import React, { Component, createContext } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { Query, Subscription } from "react-apollo";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import { Titled } from "react-titled";
import { Route, Redirect } from "react-router";
import { find, flatMap, flowRight } from "lodash";

import BaseLayout from "components/BaseLayout";
import { Grid, Column } from "components/Grid";
import Loading from "components/Loading";

import { SECTION, PAGE, QUESTION_CONFIRMATION } from "constants/entities";

import { buildSectionPath, buildIntroductionPath } from "utils/UrlUtils";

import pageRoutes from "App/page";
import sectionRoutes from "App/section";
import questionConfirmationRoutes from "App/questionConfirmation";
import introductionRoutes from "App/introduction";
import ValidationContext from "App/ValidationContext";

import withCreateQuestionPage from "enhancers/withCreateQuestionPage";
import withCreateSection from "enhancers/withCreateSection";
import withCreateCalculatedSummaryPage from "enhancers/withCreateCalculatedSummaryPage";

import { raiseToast } from "redux/toast/actions";

import withCreateQuestionConfirmation from "./withCreateQuestionConfirmation";
import NavigationSidebar from "./NavigationSidebar";

import { ERR_PAGE_NOT_FOUND } from "constants/error-codes";

export class UnwrappedQuestionnaireDesignPage extends Component {
  static propTypes = {
    onAddQuestionPage: PropTypes.func.isRequired,
    onAddCalculatedSummaryPage: PropTypes.func.isRequired,
    onCreateQuestionConfirmation: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: CustomPropTypes.match,
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire,
    }),
    location: PropTypes.object, // eslint-disable-line
    error: PropTypes.object, // eslint-disable-line
    client: PropTypes.object, // eslint-disable-line
  };

  state = { showDeleteConfirmDialog: false, showMovePageDialog: false };

  handleAddPage = pageType => () => {
    const {
      onAddQuestionPage,
      onAddCalculatedSummaryPage,
      match,
      data: { questionnaire },
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

  getTitle = title => {
    const {
      loading,
      data: { questionnaire },
    } = this.props;
    return loading ? title : `${questionnaire.title} - ${title}`;
  };

  renderRedirect = () => {
    const {
      loading,
      data: { questionnaire },
    } = this.props;

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

    return !loading && entityName !== "introduction";
  }

  canAddQuestionConfirmation() {
    const {
      data: { questionnaire },
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
    const {
      loading,
      data: { questionnaire },
      error,
      location,
    } = this.props;

    if (!loading && !error && !questionnaire) {
      throw new Error(ERR_PAGE_NOT_FOUND);
    }

    console.log(this.props.subscription);

    return (
      <BaseLayout
        questionnaire={questionnaire}
        title={loading ? "" : questionnaire.displayName}
      >
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
            <Column cols={9}>
              <Switch location={location}>
                {[
                  ...pageRoutes,
                  ...sectionRoutes,
                  ...questionConfirmationRoutes,
                  ...introductionRoutes,
                ]}
                <Route path="*" render={this.renderRedirect} />
              </Switch>
            </Column>
          </Grid>
        </Titled>
      </BaseLayout>
    );
  }
}

const withMutations = flowRight(
  connect(
    null,
    { raiseToast }
  ),
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
      ...NavigationSidebar
    }
  }
  ${NavigationSidebar.fragments.NavigationSidebar}
`;

const VALIDATION_QUERY = gql`
  subscription Validation($id: ID!) {
    validationUpdated(id: $id) {
      id
      errorCount
    }
  }
`;

export default withMutations(props => (
  <Query
    query={QUESTIONNAIRE_QUERY}
    variables={{
      input: {
        questionnaireId: props.match.params.questionnaireId,
      },
    }}
  >
    {innerProps => (
      <Subscription
        subscription={VALIDATION_QUERY}
        variables={{ id: props.match.params.questionnaireId }}
      >
        {subscriptionProps => (
          <ValidationContext.Provider
            value={
              !subscriptionProps.loading &&
              subscriptionProps.data &&
              subscriptionProps.data.validationUpdated &&
              subscriptionProps.data.validationUpdated.errorCount
            }
          >
            <UnwrappedQuestionnaireDesignPage
              {...innerProps}
              {...props}
              subscription={subscriptionProps}
            />
          </ValidationContext.Provider>
        )}
      </Subscription>
    )}
  </Query>
));
