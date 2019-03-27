import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const GET_AVAILABLE_ROUTING_QUESTIONS = gql`
  query GetAvailableRoutingQuestions($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      availableRoutingQuestions {
        id
        displayName
        section {
          id
          displayName
        }
      }
    }
  }
`;

const AvailableRoutingQuestionsQuery = ({ pageId, children }) => (
  <Query
    query={GET_AVAILABLE_ROUTING_QUESTIONS}
    variables={{ input: { pageId } }}
    fetchPolicy="cache-and-network"
  >
    {children}
  </Query>
);

AvailableRoutingQuestionsQuery.propTypes = {
  pageId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default AvailableRoutingQuestionsQuery;
