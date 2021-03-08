import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import gql from "graphql-tag";
import { flowRight } from "lodash";

import getIdForObject from "utils/getIdForObject";
import withChangeUpdate from "enhancers/withChangeUpdate";
import withPropRenamed from "enhancers/withPropRenamed";
import withEntityEditor from "components/withEntityEditor";
import focusOnEntity from "utils/focusOnEntity";
import TotalValidationRuleFragment from "graphql/fragments/total-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";

import PageHeader from "../PageHeader";
import withUpdateAnswer from "../answers/withUpdateAnswer";
import withCreateAnswer from "../answers/withCreateAnswer";
import withDeleteAnswer from "../answers/withDeleteAnswer";
import withCreateOption from "../answers/withCreateOption";
import withUpdateOption from "../answers/withUpdateOption";
import withDeleteOption from "../answers/withDeleteOption";
import withCreateExclusive from "../answers/withCreateExclusive";

import AnswersEditor from "./AnswersEditor";
import AnswerTypeSelector from "./AnswerTypeSelector";
import withUpdateQuestionPage from "./withUpdateQuestionPage";

import MetaEditor from "./MetaEditor";
import AdditionalInfo from "./AdditionalInfo";

import { useSetNavigationCallbacksForPage } from "components/NavigationCallbacks";

const QuestionSegment = styled.div`
  padding: 0 2em;
`;

const AddAnswerSegment = styled.div`
  padding: 0 2em 2em;
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
    match,
  } = props;

  useSetNavigationCallbacksForPage({
    page: page,
    folder: page?.folder,
    section: page?.section,
  });

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
          />
        </QuestionSegment>
        <AnswersEditor
          answers={answers}
          onUpdate={onUpdateAnswer}
          onAddOption={onAddOption}
          onAddExclusive={onAddExclusive}
          onUpdateOption={onUpdateOption}
          onDeleteOption={onDeleteOption}
          onDeleteAnswer={(answerId) => onDeleteAnswer(id, answerId)}
          data-test="answers-editor"
        />
      </div>

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
      <QuestionSegment>
        <AdditionalInfo
          onChange={onChange}
          onUpdate={onUpdate}
          page={page}
          fetchAnswers={fetchAnswers}
        />
      </QuestionSegment>
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
        questionnaire {
          id
          metadata {
            id
            displayName
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
