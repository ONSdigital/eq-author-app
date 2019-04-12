import React from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { get } from "lodash";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";

import EditorLayout from "App/page/Design/EditorLayout";
import Loading from "components/Loading";
import Error from "components/Error";

import RoutingPage from "./RoutingPage";
import transformNestedFragments from "utils/transformNestedFragments";

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
  };

  renderContent() {
    const { data, loading, error } = this.props;

    if (loading) {
      return <Loading height="20em">Loading routing</Loading>;
    }

    const page = get(data, "page");

    if (error || !page) {
      return <Error>Something went wrong</Error>;
    }

    return <RoutingPage page={page} />;
  }

  render() {
    return (
      <EditorLayout design preview routing>
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

const query = gql`
  query GetRouting($input: QueryInput!) {
    page(input: $input) {
      ...RoutingPage
    }
  }
`;
const ROUTING_QUERY = transformNestedFragments(query, RoutingPage.fragments);

const QueryingRoute = props => (
  <Query
    query={ROUTING_QUERY}
    variables={{ input: props.match.params }}
    fetchPolicy="network-only"
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
