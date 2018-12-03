import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableAnswers from "graphql/fragments/available-answers.graphql";
import AvailableMetadata from "graphql/fragments/available-metadata.graphql";

export const GET_METADATA_PIPING_CONTENT = gql`
  query GetMetadata($id: ID!) {
    questionnaire(id: $id) {
      id
      metadata {
        id
        displayName
      }
    }
  }
`;

export const GET_PIPING_CONTENT_PAGE = gql`
  query GetAvailablePipingContent($id: ID!) {
    questionPage(id: $id) {
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

export const GET_PIPING_CONTENT_SECTION = gql`
  query GetAvailablePipingContent($id: ID!) {
    section(id: $id) {
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

export const GET_PIPING_CONTENT_QUESTION_CONFIRMATION = gql`
  query GetAvailablePipingContent($id: ID!) {
    questionConfirmation(id: $id) {
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

const determineQuery = ({
  confirmationId,
  pageId,
  sectionId,
  questionnaireId,
  introductionId
}) => {
  if (introductionId) {
    return {
      variables: { id: questionnaireId },
      query: GET_METADATA_PIPING_CONTENT
    };
  }

  if (confirmationId) {
    return {
      variables: { id: confirmationId },
      query: GET_PIPING_CONTENT_QUESTION_CONFIRMATION
    };
  }
  if (pageId) {
    return { variables: { id: pageId }, query: GET_PIPING_CONTENT_PAGE };
  }
  return {
    variables: { id: sectionId },
    query: GET_PIPING_CONTENT_SECTION
  };
};

const AvailablePipingContentQuery = ({
  pageId,
  sectionId,
  confirmationId,
  introductionId,
  questionnaireId,
  children
}) => {
  const { variables, query } = determineQuery({
    pageId,
    sectionId,
    confirmationId,
    introductionId,
    questionnaireId
  });
  return (
    <Query query={query} variables={variables} fetchPolicy="cache-and-network">
      {children}
    </Query>
  );
};

AvailablePipingContentQuery.propTypes = {
  pageId: PropTypes.string,
  sectionId: PropTypes.string,
  confirmationId: PropTypes.string,
  children: PropTypes.func.isRequired
};

export default AvailablePipingContentQuery;
