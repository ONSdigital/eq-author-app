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
import NavigationSidebar from "./NavigationSidebar";
import QuestionPageRoute from "App/questionPage/Design";
import PreviewRoute from "components/PreviewRoute";
import SectionRoute from "App/section/Design";
import { Routes, buildSectionPath } from "utils/UrlUtils";
import Loading from "components/Loading";
import RoutingPageRoute from "App/questionPage/Routing";
import QuestionConfirmationRoute from "App/questionConfirmation/Design";

import withCreatePage from "enhancers/withCreatePage";
import withCreateSection from "enhancers/withCreateSection";
import withCreateQuestionConfirmation from "./withCreateQuestionConfirmation";

import { raiseToast } from "redux/toast/actions";

const isAnId = possibleId => /\d+/.test(possibleId);

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
    const { pageId, sectionId } = match.params;

    const pages = flatMap(questionnaire.sections, "pages");
    const page = find(pages, { id: pageId });

    onAddPage(sectionId, page ? page.position + 1 : 0);
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
        params: { sectionId, pageId, confirmationId },
      },
      loading,
    } = this.props;

    if (loading || !questionnaire) {
      return false;
    }

    const isOnPage = sectionId && isAnId(pageId) && !isAnId(confirmationId);
    if (!isOnPage) {
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
        params: { pageId },
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
            <Column>
              <Switch location={location}>
                <Route path={Routes.SECTION} component={SectionRoute} exact />
                <Route path={Routes.PAGE} component={QuestionPageRoute} exact />
                <Route
                  path={Routes.ROUTING}
                  component={RoutingPageRoute}
                  exact
                />
                <Route
                  path={Routes.PAGE_PREVIEW}
                  component={PreviewRoute}
                  exact
                />
                <Route
                  path={Routes.CONFIRMATION}
                  component={QuestionConfirmationRoute}
                  exact
                />
                <Route
                  path={Routes.CONFIRMATION_PREVIEW}
                  component={PreviewRoute}
                  exact
                />
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
