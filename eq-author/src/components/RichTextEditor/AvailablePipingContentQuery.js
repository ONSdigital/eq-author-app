import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import gql from "graphql-tag";

import AvailableAnswers from "graphql/fragments/available-answers.graphql";
import AvailableMetadata from "graphql/fragments/available-metadata.graphql";

export const GET_PIPING_CONTENT_PAGE = gql`
  query GetAvailablePipingContentForPage($input: QueryInput!) {
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
  query GetAvailablePipingContentForSection($input: QueryInput!) {
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
  query GetAvailablePipingContentForQuestionConfirmation($id: ID!) {
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

export const GET_PIPING_CONTENT_INTRODUCTION = gql`
  query GetAvailablePipingContentForQuestionIntroduction($id: ID!) {
    questionnaireIntroduction(id: $id) {
      id
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
  introductionId,
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
  if (sectionId) {
    return {
      variables: { input: { questionnaireId, sectionId } },
      query: GET_PIPING_CONTENT_SECTION,
    };
  }
  if (introductionId) {
    return {
      variables: { id: introductionId },
      query: GET_PIPING_CONTENT_INTRODUCTION,
    };
  }
};

const AvailablePipingContentQuery = ({
  questionnaireId,
  pageId,
  sectionId,
  confirmationId,
  introductionId,
  children,
}) => {
  const { variables, query } = determineQuery({
    questionnaireId,
    pageId,
    sectionId,
    confirmationId,
    introductionId,
  });
  return (
    <Query query={query} variables={variables} fetchPolicy="network-only">
      {children}
    </Query>
  );
};

AvailablePipingContentQuery.propTypes = {
  questionnaireId: PropTypes.string,
  pageId: PropTypes.string,
  sectionId: PropTypes.string,
  confirmationId: PropTypes.string,
  introductionId: PropTypes.string,
  children: PropTypes.func.isRequired,
};

export default AvailablePipingContentQuery;
