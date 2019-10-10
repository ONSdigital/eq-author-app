import React, { Component } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { Query, Subscription } from "react-apollo";
import { Switch } from "react-router-dom";
import { Titled } from "react-titled";
import { Route, Redirect } from "react-router";
import { get, find, flatMap, flowRight } from "lodash";

import { Grid, Column } from "components/Grid";
import Loading from "components/Loading";
import BaseLayout from "components/BaseLayout";
import QuestionnaireContext from "components/QuestionnaireContext";

import { SECTION, PAGE, QUESTION_CONFIRMATION } from "constants/entities";
import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

import { buildSectionPath, buildIntroductionPath } from "utils/UrlUtils";

import pageRoutes from "App/page";
import sectionRoutes from "App/section";
import questionConfirmationRoutes from "App/questionConfirmation";
import introductionRoutes from "App/introduction";
import metadataRoutes from "App/metadata";
import historyRoutes from "App/history";

import withCreateQuestionPage from "enhancers/withCreateQuestionPage";
import withCreateSection from "enhancers/withCreateSection";
import withCreateCalculatedSummaryPage from "enhancers/withCreateCalculatedSummaryPage";

import withCreateQuestionConfirmation from "./withCreateQuestionConfirmation";
import NavigationSidebar from "./NavigationSidebar";

export class UnwrappedQuestionnaireDesignPage extends Component {
  static propTypes = {
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    onCreateQuestionConfirmation: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: CustomPropTypes.match.isRequired,
    questionnaire: CustomPropTypes.questionnaire,
    location: PropTypes.object, // eslint-disable-line
    error: PropTypes.object, // eslint-disable-line
    validations: PropTypes.object, // eslint-disable-line
  };

  state = {
    showDeleteConfirmDialog: false,
    showMovePageDialog: false,
  };

  handleAddPage = pageType => () => {
    const {
      onAddQuestionPage,
      onAddCalculatedSummaryPage,
      match,
      questionnaire,
    } = this.props;
    const { entityName, entityId } = match.params;

    let sectionId, position;
    if (entityName === SECTION) {
      sectionId = entityId;
      position = 0;
    } else if (entityName === PAGE) {
      for (let i = 0; i < questionnaire.sections.length; ++i) {
        const section = questionnaire.sections[i];
        const page = find(section.pages, { id: entityId });
        if (page) {
          sectionId = section.id;
          position = section.pages.indexOf(page) + 1;
          break;
        }
      }
    } else if (entityName === QUESTION_CONFIRMATION) {
      for (let i = 0; i < questionnaire.sections.length; ++i) {
        const section = questionnaire.sections[i];
        const page = find(section.pages, { confirmation: { id: entityId } });
        if (page) {
          sectionId = section.id;
          position = section.pages.indexOf(page) + 1;
          break;
        }
      }
    }
    if (pageType === "QuestionPage") {
      onAddQuestionPage(sectionId, position);
    } else {
      onAddCalculatedSummaryPage(sectionId, position);
    }
  };

  getTitle = () => {
    const { loading, questionnaire } = this.props;
    return loading ? "" : `${questionnaire.title}`;
  };

  renderRedirect = () => {
    const { loading, questionnaire } = this.props;

    if (loading) {
      return (
        <Grid>
          <Column cols={10}>
            <Loading height="100%">Loading questionnaire…</Loading>
          </Column>
        </Grid>
      );
    }

    if (questionnaire.introduction) {
      return (
        <Redirect
          to={buildIntroductionPath({
            questionnaireId: questionnaire.id,
            introductionId: questionnaire.introduction.id,
          })}
        />
      );
    }

    return (
      <Redirect
        to={buildSectionPath({
          questionnaireId: questionnaire.id,
          sectionId: questionnaire.sections[0].id,
        })}
      />
    );
  };

  canAddQuestionAndCalculatedSummmaryPages() {
    const {
      match: {
        params: { entityName },
      },
      loading,
    } = this.props;

    return !loading && ["page", "section"].includes(entityName);
  }

  canAddQuestionConfirmation() {
    const {
      questionnaire,
      match: {
        params: { entityName, entityId: pageId },
      },
      loading,
    } = this.props;

    if (loading || !questionnaire) {
      return false;
    }

    if (entityName !== "page") {
      return false;
    }

    const pages = flatMap(questionnaire.sections, "pages");
    const page = find(pages, { id: pageId });
    if (!page || page.confirmation || page.pageType !== "QuestionPage") {
      return false;
    }
    return true;
  }

  handleAddQuestionConfirmation = () => {
    const {
      match: {
        params: { entityId: pageId },
      },
    } = this.props;
    this.props.onCreateQuestionConfirmation(pageId);
  };

  render() {
    const { loading, questionnaire, error, location } = this.props;

    if (!loading && !error && !questionnaire) {
      throw new Error(ERR_PAGE_NOT_FOUND);
    }

    return (
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        <BaseLayout questionnaire={questionnaire}>
          <Titled title={this.getTitle}>
            <Grid>
              <Column cols={3} gutters={false}>
                <NavigationSidebar
                  data-test="side-nav"
                  loading={loading}
                  onAddSection={this.props.onAddSection}
                  onAddQuestionPage={this.handleAddPage("QuestionPage")}
                  canAddQuestionPage={this.canAddQuestionAndCalculatedSummmaryPages()}
                  onAddCalculatedSummaryPage={this.handleAddPage(
                    "CalculatedSummaryPage"
                  )}
                  canAddCalculatedSummaryPage={this.canAddQuestionAndCalculatedSummmaryPages()}
                  questionnaire={questionnaire}
                  canAddQuestionConfirmation={this.canAddQuestionConfirmation()}
                  onAddQuestionConfirmation={this.handleAddQuestionConfirmation}
                />
              </Column>
              <Column cols={9} gutters={false}>
                <Switch location={location}>
                  {[
                    ...pageRoutes,
                    ...sectionRoutes,
                    ...questionConfirmationRoutes,
                    ...introductionRoutes,
                    ...metadataRoutes,
                    ...historyRoutes,
                  ]}
                  <Route path="*" render={this.renderRedirect} />
                </Switch>
              </Column>
            </Grid>
          </Titled>
        </BaseLayout>
      </QuestionnaireContext.Provider>
    );
  }
}

const withMutations = flowRight(
  withCreateSection,
  withCreateQuestionPage,
  withCreateQuestionConfirmation,
  withCreateCalculatedSummaryPage
);

const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
      introduction {
        id
      }
      totalErrorCount
      ...NavigationSidebar
    }
  }
  ${NavigationSidebar.fragments.NavigationSidebar}
`;

export const withQuestionnaire = Component => {
  const WrappedComponent = props => (
    <Query
      query={QUESTIONNAIRE_QUERY}
      variables={{
        input: {
          questionnaireId: props.match.params.questionnaireId,
        },
      }}
      fetchPolicy="network-only"
      errorPolicy="all"
    >
      {innerProps => (
        <Component
          {...innerProps}
          {...props}
          questionnaire={get(innerProps, "data.questionnaire")}
        />
      )}
    </Query>
  );

  WrappedComponent.displayName = `withQuestionnaire(${Component.displayName})`;
  WrappedComponent.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  return WrappedComponent;
};

export const withAuthCheck = Component => {
  const WrappedComponent = props => {
    if (
      get(props, "error.networkError.bodyText") ===
      ERR_UNAUTHORIZED_QUESTIONNAIRE
    ) {
      throw new Error(ERR_UNAUTHORIZED_QUESTIONNAIRE);
    }
    return <Component {...props} />;
  };
  WrappedComponent.displayName = `withAuthCheck(${Component.displayName})`;
  return WrappedComponent;
};

const VALIDATION_QUERY = gql`
  subscription Validation($id: ID!) {
    validationUpdated(id: $id) {
      id
      totalErrorCount
      sections {
        id
        validationErrorInfo {
          id
          totalCount
        }
        pages {
          id
          ... on QuestionPage {
            validationErrorInfo {
              id
              totalCount
            }
          }
        }
      }
    }
  }
`;

export const withValidations = Component => {
  const WrappedComponent = props => (
    <Subscription
      subscription={VALIDATION_QUERY}
      variables={{ id: props.match.params.questionnaireId }}
    >
      {subscriptionProps => (
        <Component
          {...props}
          validations={get(subscriptionProps, "data.validationUpdated")}
        />
      )}
    </Subscription>
  );
  WrappedComponent.displayName = `withValidations(${Component.displayName})`;
  WrappedComponent.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };
  return WrappedComponent;
};

export default flowRight([
  withQuestionnaire,
  withAuthCheck,
  withValidations,
  withMutations,
])(UnwrappedQuestionnaireDesignPage);
