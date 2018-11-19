import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableAnswers from "graphql/fragments/available-answers.graphql";

const GET_AVAILABLE_PREVIOUS_ANSWERS = gql`
  query GetAvailablePreviousAnswers($id: ID!) {
    answer(id: $id) {
      id
      displayName
      ... on BasicAnswer {
        validation {
          ... on NumberValidation {
            maxValue {
              id
              availablePreviousAnswers {
                ...AvailableAnswers
              }
            }
          }
          ... on DateValidation {
            earliestDate {
              id
              availablePreviousAnswers {
                ...AvailableAnswers
              }
            }
            latestDate {
              id
              availablePreviousAnswers {
                ...AvailableAnswers
              }
            }
          }
        }
      }
    }
  }
  ${AvailableAnswers}
`;

const AvailablePreviousAnswersQuery = ({ answerId, children }) => (
  <Query
    query={GET_AVAILABLE_PREVIOUS_ANSWERS}
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

AvailablePreviousAnswersQuery.propTypes = {
  answerId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default AvailablePreviousAnswersQuery;
