import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableAnswers from "graphql/fragments/available-answers.graphql";
import AvailableMetadata from "graphql/fragments/available-metadata.graphql";

export const GET_PIPING_CONTENT_PAGE = gql`
  query GetAvailablePipingContent($input: QueryInput!) {
    page(input: $input) {
      id
      displayName
      pageType
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
  query GetAvailablePipingContent($input: QueryInput!) {
    section(input: $input) {
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
  questionnaireId,
  confirmationId,
  pageId,
  sectionId,
}) => {
  if (confirmationId) {
    return {
      variables: { id: confirmationId },
      query: GET_PIPING_CONTENT_QUESTION_CONFIRMATION,
    };
  }
  if (pageId) {
    return {
      variables: { input: { questionnaireId, pageId } },
      query: GET_PIPING_CONTENT_PAGE,
    };
  }
  return {
    variables: { input: { questionnaireId, sectionId } },
    query: GET_PIPING_CONTENT_SECTION,
  };
};

const AvailablePipingContentQuery = ({
  questionnaireId,
  pageId,
  sectionId,
  confirmationId,
  children,
}) => {
  const { variables, query } = determineQuery({
    questionnaireId,
    pageId,
    sectionId,
    confirmationId,
  });
  return (
    <Query query={query} variables={variables} fetchPolicy="cache-and-network">
      {children}
    </Query>
  );
};

AvailablePipingContentQuery.propTypes = {
  questionnaireId: PropTypes.string,
  pageId: PropTypes.string,
  sectionId: PropTypes.string,
  confirmationId: PropTypes.string,
  children: PropTypes.func.isRequired,
};

export default AvailablePipingContentQuery;
