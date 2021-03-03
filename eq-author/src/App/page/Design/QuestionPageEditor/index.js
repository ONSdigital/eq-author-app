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

const QuestionSegment = styled.div`
  padding: 0 2em;
`;

const AddAnswerSegment = styled.div`
  padding: 0 2em 2em;
`;

export class UnwrappedQuestionPageEditor extends React.Component {
  static propTypes = {
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

  handleDeleteAnswer = (answerId) => {
    this.props.onDeleteAnswer(this.props.page.id, answerId);
  };

  handleAddAnswer = (answerType) => {
    const { match, onAddAnswer } = this.props;

    return onAddAnswer(match.params.pageId, answerType).then(focusOnEntity);
  };

  render() {
    const {
      page,
      page: { answers },
      onChange,
      onUpdate,
      onUpdateAnswer,
      onAddOption,
      onUpdateOption,
      onDeleteOption,
      onAddExclusive,
      fetchAnswers,
      enableValidationMessage,
    } = this.props;

    const id = getIdForObject(page);

    return (
      <div data-test="question-page-editor">
        <PageHeader
          {...this.props}
          onUpdate={onUpdate}
          onChange={this.props.onChange}
          alertText="All edits, properties and routing settings will also be removed."
        />
        <div>
          <QuestionSegment id={id}>
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
            onDeleteAnswer={this.handleDeleteAnswer}
            data-test="answers-editor"
          />
        </div>

        <AddAnswerSegment>
          <AnswerTypeSelector
            answerCount={answers.length}
            onSelect={this.handleAddAnswer}
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
  }
}

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
      section {
        id
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
