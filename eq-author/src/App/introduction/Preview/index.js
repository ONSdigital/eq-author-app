/*  eslint-disable react/no-danger */
import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import PropTypes from "prop-types";

import Comment from "graphql/fragments/comment.graphql";

import IntroductionPreview from "./IntroductionPreview";

export const fragment = gql`
  fragment QuestionnaireIntroduction on QuestionnaireIntroduction {
    id
    title
    contactDetailsPhoneNumber
    contactDetailsEmailAddress
    additionalGuidancePanel
    additionalGuidancePanelSwitch
    description
    secondaryTitle
    secondaryDescription
    collapsibles {
      id
      title
      description
    }
    tertiaryTitle
    tertiaryDescription
    comments {
      ...Comment
    }
  }
  ${Comment}
`;

export const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaireIntroduction($id: ID!) {
    questionnaireIntroduction(id: $id) {
      ...QuestionnaireIntroduction
    }
  }
  ${fragment}
`;

const IntroductionPreviewWithData = (props) => (
  <Query
    query={QUESTIONNAIRE_QUERY}
    variables={{ id: props.match.params.introductionId }}
  >
    {(innerProps) => <IntroductionPreview {...innerProps} {...props} />}
  </Query>
);
IntroductionPreviewWithData.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      introductionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default IntroductionPreviewWithData;
