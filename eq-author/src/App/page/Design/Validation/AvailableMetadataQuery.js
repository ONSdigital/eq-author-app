import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableMetadata from "graphql/fragments/available-metadata.graphql";

const GET_AVAILABLE_METADATA = gql`
  query GetAvailableMetadata($input: QueryInput!) {
    answer(input: $input) {
      id
      displayName
      ... on BasicAnswer {
        validation {
          ... on DateValidation {
            earliestDate {
              id
              offset {
                value
                unit
              }
              availableMetadata {
                ...AvailableMetadata
              }
            }
            latestDate {
              id
              offset {
                value
                unit
              }
              availableMetadata {
                ...AvailableMetadata
              }
            }
          }
          ... on DateRangeValidation {
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
    variables={{ input: { answerId } }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

AvailableMetadataQuery.propTypes = {
  answerId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default AvailableMetadataQuery;
