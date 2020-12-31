/* eslint-disable import/no-unresolved */
import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";

import { get } from "lodash";
import PropTypes from "prop-types";

import Loading from "components/Loading";
import Error from "components/Error";

import SkipLogicPage from "./SkipLogicPage";
import transformNestedFragments from "utils/transformNestedFragments";
import { buildPagePath } from "utils/UrlUtils";
import Logic from "App/shared/Logic";
const ROUTING_PAGE_TYPES = ["QuestionPage"];

export class UnwrappedQuestionSkipLogicRoute extends React.Component {
  static propTypes = {
    data: PropTypes.object, // eslint-disable-line
    loading: PropTypes.bool.isRequired,
    error: PropTypes.object, // eslint-disable-line
    match: PropTypes.shape({
      params: PropTypes.shape({
        questionnaireId: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  renderContent() {
    const { data, loading, error, match } = this.props;

    if (loading) {
      return <Loading height="20em">Loading skip logic</Loading>;
    }

    const page = get(data, "page");

    if (error || !page) {
      return <Error>Something went wrong</Error>;
    }

    if (!ROUTING_PAGE_TYPES.includes(page.pageType)) {
      return (
        <Redirect
          to={buildPagePath({
            questionnaireId: match.params.questionnaireId,
            pageId: page.id,
          })}
        />
      );
    }

    return <SkipLogicPage page={page} />;
  }

  render() {
    return <Logic {...this.props}>{this.renderContent()}</Logic>;
  }
}

const query = gql`
  query GetRouting($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      pageType
      ...SkipLogicPage
      section {
        id
        position
      }
    }
  }
`;
const SKIPLOGIC_QUERY = transformNestedFragments(
  query,
  SkipLogicPage.fragments
);

const QueryingRoute = props => (
  <Query
    query={SKIPLOGIC_QUERY}
    variables={{ input: props.match.params }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => (
      <UnwrappedQuestionSkipLogicRoute {...innerProps} {...props} />
    )}
  </Query>
);
QueryingRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      pageId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default QueryingRoute;
