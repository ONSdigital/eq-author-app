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
import Logic from "App/shared/Logic";

import { PageContextProvider } from "components/QuestionnaireContext";
import Comment from "graphql/fragments/comment.graphql";

const ROUTING_PAGE_TYPES = [
  "QuestionPage",
  "CalculatedSummaryPage",
  "ListCollectorPage",
];

export class UnwrappedQuestionRoutingRoute extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      page: propType(
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
    const page = this.props.data?.page;
    return (
      <PageContextProvider value={page}>
        <Logic page={page}>{this.renderContent()}</Logic>
      </PageContextProvider>
    );
  }
}

const query = gql`
  query GetRouting($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      pageType
      ... on CalculatedSummaryPage {
        comments {
          ...Comment
        }
      }
      ... on QuestionPage {
        comments {
          ...Comment
        }
      }
      ...RoutingPage
      section {
        id
        position
      }
    }
  }
  ${Comment}
`;
const ROUTING_QUERY = transformNestedFragments(query, RoutingPage.fragments);

const QueryingRoute = (props) => (
  <Query
    query={ROUTING_QUERY}
    variables={{ input: props.match.params }}
    fetchPolicy="cache-and-network"
  >
    {(innerProps) => (
      <UnwrappedQuestionRoutingRoute {...innerProps} {...props} />
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
