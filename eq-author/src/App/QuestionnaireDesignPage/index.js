import React, { Component } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { connect } from "react-redux";
import { Switch } from "react-router-dom";
import { Titled } from "react-titled";
import { Route, Redirect } from "react-router";
import { find, flatMap, flowRight } from "lodash";

import BaseLayout from "components/BaseLayout";
import { Grid, Column } from "components/Grid";
import Loading from "components/Loading";

import { SECTION, PAGE, QUESTION_CONFIRMATION } from "constants/entities";

import { buildSectionPath } from "utils/UrlUtils";

import questionPageRoutes from "App/questionPage";
import sectionRoutes from "App/section";
import questionConfirmationRoutes from "App/questionConfirmation";

import withCreatePage from "enhancers/withCreatePage";
import withCreateSection from "enhancers/withCreateSection";

import { raiseToast } from "redux/toast/actions";

import withCreateQuestionConfirmation from "./withCreateQuestionConfirmation";
import NavigationSidebar from "./NavigationSidebar";

export class UnwrappedQuestionnaireDesignPage extends Component {
  static propTypes = {
    onAddPage: PropTypes.func.isRequired,
    onCreateQuestionConfirmation: PropTypes.func.isRequired,
    onAddSection: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: CustomPropTypes.match,
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire,
    }),
    location: PropTypes.object, // eslint-disable-line
  };

  state = { showDeleteConfirmDialog: false, showMovePageDialog: false };

  handleAddPage = () => {
    const {
      onAddPage,
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
    onAddPage(sectionId, position);
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

    return (
      <Redirect
        to={buildSectionPath({
          questionnaireId: questionnaire.id,
          sectionId: questionnaire.sections[0].id,
        })}
      />
    );
  };

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
    if (!page || page.confirmation) {
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
      location,
    } = this.props;

    return (
      <BaseLayout questionnaire={questionnaire}>
        <Titled title={this.getTitle}>
          <Grid>
            <Column cols={3} gutters={false}>
              <NavigationSidebar
                data-test="side-nav"
                loading={loading}
                onAddSection={this.props.onAddSection}
                onAddPage={this.handleAddPage}
                questionnaire={questionnaire}
                canAddQuestionConfirmation={this.canAddQuestionConfirmation()}
                onAddQuestionConfirmation={this.handleAddQuestionConfirmation}
              />
            </Column>
            <Column cols={9}>
              <Switch location={location}>
                {[
                  ...questionPageRoutes,
                  ...sectionRoutes,
                  ...questionConfirmationRoutes,
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
  withCreatePage,
  withCreateQuestionConfirmation
);

const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
      ...NavigationSidebar
    }
  }
  ${NavigationSidebar.fragments.NavigationSidebar}
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
      <UnwrappedQuestionnaireDesignPage {...innerProps} {...props} />
    )}
  </Query>
));
