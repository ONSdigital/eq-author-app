import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableMetadata from "graphql/fragments/available-metadata.graphql";

const GET_AVAILABLE_METADATA = gql`
  query GetAvailableMetadata($id: ID!) {
    answer(id: $id) {
      id
      displayName
      ... on BasicAnswer {
        validation {
          ... on DateValidation {
            earliestDate {
              id
              availableMetadata {
                ...AvailableMetadata
              }
            }
            latestDate {
              id
              availableMetadata {
                ...AvailableMetadata
              }
            }
          }
        }
      }
    }
  }
  ${AvailableMetadata}
`;

const AvailableMetadataQuery = ({ answerId, children }) => (
  <Query
    query={GET_AVAILABLE_METADATA}
    variables={{ id: answerId }}
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

AvailableMetadataQuery.propTypes = {
  answerId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default AvailableMetadataQuery;
