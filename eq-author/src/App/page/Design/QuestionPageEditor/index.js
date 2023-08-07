import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";
import { colors } from "constants/theme";

import getIdForObject from "utils/getIdForObject";
import withChangeUpdate from "enhancers/withChangeUpdate";
import withPropRenamed from "enhancers/withPropRenamed";
import withEntityEditor from "components/withEntityEditor";
import focusOnEntity from "utils/focusOnEntity";
import TotalValidationRuleFragment from "graphql/fragments/total-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import CommentFragment from "graphql/fragments/comment.graphql";

import PageTitleContainer from "components/PageTitle";

import PageHeader from "../PageHeader";
import withUpdateAnswer from "../answers/withUpdateAnswer";
import withCreateAnswer from "../answers/withCreateAnswer";
import withDeleteAnswer from "../answers/withDeleteAnswer";
import withCreateOption from "../answers/withCreateOption";
import withUpdateOption from "../answers/withUpdateOption";
import withDeleteOption from "../answers/withDeleteOption";
import withCreateExclusive from "../answers/withCreateExclusive";

import AnswersEditor from "./AnswersEditor";
import AnswerTypeSelector from "components/AnswerTypeSelector";
import withUpdateQuestionPage from "./withUpdateQuestionPage";

import MetaEditor from "./MetaEditor";

import QuestionProperties from "./QuestionProperties";
import TotalValidation from "../Validation/GroupValidations/TotalValidation";

import {
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
} from "constants/validationMessages";

import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";
import ContentContainer from "components/ContentContainer";
import ValidationError from "components/ValidationError";

const QuestionSegment = styled.div`
  padding: 0 2em;
`;
const PageTitleSegment = styled.div`
  padding: 0 2em;
`;

const AddAnswerSegment = styled.div`
  padding: 0 2em 2em;
`;

const HorizontalRule = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.grey};
  margin: 1.5em 0;
`;

const propTypes = {
  onUpdateAnswer: PropTypes.func.isRequired,
  onAddAnswer: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  match: CustomPropTypes.match.isRequired,
  page: CustomPropTypes.page.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fetchAnswers: PropTypes.func.isRequired,
  enableValidationMessage: PropTypes.bool,
  allCalculatedSummaryPages: PropTypes.array, //eslint-disable-line
};
export const UnwrappedQuestionPageEditor = (props) => {
  const {
    page,
    page: { id, answers },
    onChange,
    onUpdate,
    onUpdateAnswer,
    onAddOption,
    onUpdateOption,
    onDeleteOption,
    onAddExclusive,
    fetchAnswers,
    enableValidationMessage,
    onAddAnswer,
    onDeleteAnswer,
    allCalculatedSummaryPages,
    match,
  } = props;

  useSetNavigationCallbacksForPage({
    page: page,
    folder: page?.folder,
    section: page?.section,
  });

  const totalValidationErrors = page.validationErrorInfo.errors.filter(
    ({ field }) => field === "totalValidation"
  );
  const error = totalValidationErrors?.[0];

  const errorMessages = {
    ERR_NO_VALUE,
    ERR_REFERENCE_MOVED,
    ERR_REFERENCE_DELETED,
  };

  return (
    <div data-test="question-page-editor">
      <PageHeader
        {...props}
        onUpdate={onUpdate}
        onChange={onChange}
        alertText="All edits, properties and routing settings will also be removed."
      />
      <div>
        <QuestionSegment id={getIdForObject(page)}>
          <MetaEditor
            onChange={onChange}
            onUpdate={onUpdate}
            page={page}
            fetchAnswers={fetchAnswers}
            enableValidationMessage={enableValidationMessage}
            allCalculatedSummaryPages={allCalculatedSummaryPages}
          />
        </QuestionSegment>
        <PageTitleSegment>
          <PageTitleContainer
            pageDescription={page.pageDescription}
            errors={page.validationErrorInfo.errors}
            onChange={onChange}
            onUpdate={onUpdate}
          />
          <HorizontalRule />
        </PageTitleSegment>
        <QuestionProperties
          page={page}
          onChange={onChange}
          onUpdate={onUpdate}
          fetchAnswers={fetchAnswers}
        />
        <AnswersEditor
          answers={answers}
          onUpdate={onUpdateAnswer}
          onAddOption={onAddOption}
          onAddExclusive={onAddExclusive}
          onUpdateOption={onUpdateOption}
          onDeleteOption={onDeleteOption}
          onDeleteAnswer={(answerId) => onDeleteAnswer(id, answerId)}
          data-test="answers-editor"
          page={page}
          metadata={page.section.questionnaire.metadata}
        />
      </div>

      {(page.totalValidation || page.answers[0]?.repeatingLabelAndInput) &&
        ["Number", "Currency", "Unit", "Percentage"].includes(
          page.answers[0].type
        ) && (
          <ContentContainer
            title={`Total ${answers[0].type.toLowerCase()} validation`}
          >
            <TotalValidation
              total={page.totalValidation}
              validationError={page.validationErrorInfo}
              type={answers[0].type}
              withoutDisableMessage
            />
            {error && (
              <ValidationError>
                {errorMessages[error.errorCode]}
              </ValidationError>
            )}
          </ContentContainer>
        )}

      <AddAnswerSegment>
        <AnswerTypeSelector
          answerCount={answers.length}
          onSelect={(answerType) =>
            onAddAnswer(match.params.pageId, answerType).then(focusOnEntity)
          }
          data-test="add-answer"
          page={page}
        />
      </AddAnswerSegment>
    </div>
  );
};

UnwrappedQuestionPageEditor.propTypes = propTypes;

UnwrappedQuestionPageEditor.fragments = {
  QuestionPage: gql`
    fragment QuestionPage on QuestionPage {
      id
      alias
      title
      pageType
      description
      descriptionEnabled
      pageDescription
      guidance
      guidanceEnabled
      definitionLabel
      definitionContent
      definitionEnabled
      additionalInfoLabel
      additionalInfoContent
      additionalInfoEnabled
      displayName
      position
      comments {
        ...Comment
      }
      answers {
        ...AnswerEditor
      }
      folder {
        id
        position
      }
      section {
        id
        position
        repeatingSection
        allowRepeatingSection
        repeatingSectionListId
        questionnaire {
          id
          metadata {
            id
            displayName
            type
            key
          }
        }
      }
      totalValidation {
        ...TotalValidationRule
      }
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
    ${CommentFragment}
    ${ValidationErrorInfoFragment}
    ${TotalValidationRuleFragment}
    ${AnswersEditor.fragments.AnswersEditor}
  `,
};

export default flowRight(
  withUpdateQuestionPage,
  withUpdateAnswer,
  withCreateAnswer,
  withDeleteAnswer,
  withCreateOption,
  withUpdateOption,
  withDeleteOption,
  withCreateExclusive,
  withPropRenamed("onUpdateQuestionPage", "onUpdate"),
  withEntityEditor("page", UnwrappedQuestionPageEditor.fragments.QuestionPage),
  withChangeUpdate
)(UnwrappedQuestionPageEditor);
