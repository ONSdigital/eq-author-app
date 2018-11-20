import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableAnswers from "graphql/fragments/available-answers.graphql";
import AvailableMetadata from "graphql/fragments/available-metadata.graphql";

const GET_AVAILABLE_PIPING_CONTENT = gql`
  query GetAvailablePipingContent($id: ID!, $sectionContent: Boolean!) {
    questionPage(id: $id) @skip(if: $sectionContent) {
      id
      displayName
      availablePipingAnswers {
        ...AvailableAnswers
      }
      availablePipingMetadata {
        ...AvailableMetadata
      }
    }
    section(id: $id) @include(if: $sectionContent) {
      id
      displayName
      availablePipingAnswers {
        ...AvailableAnswers
      }
      availablePipingMetadata {
        ...AvailableMetadata
      }
    }
  }
  ${AvailableAnswers}
  ${AvailableMetadata}
`;

const AvailablePipingContentQuery = ({ id, sectionContent, children }) => (
  <Query
    query={GET_AVAILABLE_PIPING_CONTENT}
    variables={{ id, sectionContent }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data }) =>
      children({
        loading,
        error,
        data
      })
    }
  </Query>
);

AvailablePipingContentQuery.propTypes = {
  id: PropTypes.string,
  sectionContent: PropTypes.bool.isRequired,
  children: PropTypes.func.isRequired
};

export default AvailablePipingContentQuery;
