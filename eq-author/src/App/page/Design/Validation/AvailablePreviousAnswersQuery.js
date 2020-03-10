import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableAnswers from "graphql/fragments/available-answers.graphql";

const GET_AVAILABLE_PREVIOUS_ANSWERS = gql`
  query GetAvailablePreviousAnswers($input: QueryInput!) {
    answer(input: $input) {
      id
      displayName
      ... on BasicAnswer {
        validation {
          ... on NumberValidation {
            minValue {
              id
              availablePreviousAnswers {
                ...AvailableAnswers
              }
            }
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
              offset {
                value
                unit
              }
              availablePreviousAnswers {
                ...AvailableAnswers
              }
            }
            latestDate {
              id
              offset {
                value
                unit
              }
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
    variables={{ input: { answerId } }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

AvailablePreviousAnswersQuery.propTypes = {
  answerId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default AvailablePreviousAnswersQuery;
