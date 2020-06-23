import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Redirect } from "react-router-dom";

import { get } from "lodash";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import Loading from "components/Loading";
import Error from "components/Error";

import RoutingPage from "./RoutingPage";
import transformNestedFragments from "utils/transformNestedFragments";
import { buildPagePath } from "utils/UrlUtils";

const ROUTING_PAGE_TYPES = ["QuestionPage"];

export class UnwrappedQuestionRoutingRoute extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      questionPage: propType(
        transformNestedFragments(
          RoutingPage.fragments[0],
          RoutingPage.fragments.slice(1)
        )
      ),
    }),
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
      return <Loading height="20em">Loading routing</Loading>;
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

    return <RoutingPage page={page} />;
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

const query = gql`
  query GetRouting($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      pageType
      ...RoutingPage
    }
  }
`;
const ROUTING_QUERY = transformNestedFragments(query, RoutingPage.fragments);

const QueryingRoute = props => (
  <Query
    query={ROUTING_QUERY}
    variables={{ input: props.match.params }}
    fetchPolicy="cache-and-network"
  >
    {innerProps => <UnwrappedQuestionRoutingRoute {...innerProps} {...props} />}
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
