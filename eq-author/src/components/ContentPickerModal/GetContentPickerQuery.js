import PropTypes from "prop-types";
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";

export const CONTENT_PICKER_QUERY = gql`
  query ContentPickerQuery($id: ID!) {
    questionnaire(id: $id) {
      id
      metadata {
        id
        displayName
        type
      }
      sections {
        id
        displayName
        pages {
          ... on QuestionPage {
            id
            displayName
            answers {
              id
              label
              displayName
              type
              ... on CompositeAnswer {
                childAnswers {
                  id
                  label
                  displayName
                  type
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GetContentPickerQuery = ({ questionnaireId, children }) => (
  <Query query={CONTENT_PICKER_QUERY} variables={{ id: questionnaireId }}>
    {({ loading, error, data }) => children({ loading, error, data })}
  </Query>
);

GetContentPickerQuery.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
};

export default GetContentPickerQuery;
