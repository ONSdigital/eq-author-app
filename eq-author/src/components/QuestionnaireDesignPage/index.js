import React, { Component } from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import BaseLayout from "components/BaseLayout";
import { Grid, Column } from "components/Grid";
import NavigationSidebar from "components/NavigationSidebar";
import { Switch } from "react-router-dom";
import { Route, Redirect } from "react-router";
import QuestionPageRoute from "components/QuestionPageRoute";
import SectionRoute from "components/SectionRoute";
import { find, flatMap, flowRight } from "lodash";
import { Titled } from "react-titled";
import { Routes, buildSectionPath } from "utils/UrlUtils";
import Loading from "components/Loading";
import RoutingPageRoute from "components/routing/QuestionnaireRoutingPage";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { connect } from "react-redux";

import { raiseToast } from "redux/toast/actions";
import withCreatePage from "containers/enhancers/withCreatePage";
import withCreateSection from "containers/enhancers/withCreateSection";

export class UnwrappedQuestionnaireDesignPage extends Component {
  static propTypes = {
    onAddPage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    match: CustomPropTypes.match,
    data: PropTypes.shape({
      questionnaire: CustomPropTypes.questionnaire
    }),
    location: PropTypes.object // eslint-disable-line
  };

  state = {
    showDeleteConfirmDialog: false,
    showMovePageDialog: false
  };

  handleAddPage = () => {
    const {
      onAddPage,
      match,
      data: { questionnaire }
    } = this.props;
    const { pageId, sectionId } = match.params;

    const pages = flatMap(questionnaire.sections, "pages");
    const page = find(pages, { id: pageId });

    onAddPage(sectionId, page ? page.position + 1 : 0);
  };

  getTitle = title => {
    const {
      loading,
      data: { questionnaire }
    } = this.props;
    return loading ? title : `${questionnaire.title} - ${title}`;
  };

  renderRedirect = () => {
    const {
      loading,
      data: { questionnaire }
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
          sectionId: questionnaire.sections[0].id
        })}
      />
    );
  };

  render() {
    const {
      loading,
      data: { questionnaire },
      location
    } = this.props;

    return (
      <BaseLayout questionnaire={questionnaire}>
        <Titled title={this.getTitle}>
          <Grid>
            <Column cols={3} gutters={false}>
              <NavigationSidebar
                data-test="side-nav"
                loading={loading}
                onAddPage={this.handleAddPage}
                questionnaire={questionnaire}
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
  withCreatePage
);

const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaire($id: ID!) {
    questionnaire(id: $id) {
      ...NavigationSidebar
    }
  }
  ${NavigationSidebar.fragments.NavigationSidebar}
`;

export default withMutations(props => (
  <Query
    query={QUESTIONNAIRE_QUERY}
    variables={{ id: props.match.params.questionnaireId }}
  >
    {innerProps => (
      <UnwrappedQuestionnaireDesignPage {...innerProps} {...props} />
    )}
  </Query>
));
