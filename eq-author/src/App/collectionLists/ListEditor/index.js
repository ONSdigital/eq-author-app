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

import withUpdateAnswer from "../answers/withUpdateAnswer";
import withCreateAnswer from "../answers/withCreateAnswer";
import withDeleteAnswer from "../answers/withDeleteAnswer";
import withCreateOption from "../answers/withCreateOption";
import withUpdateOption from "../answers/withUpdateOption";
import withDeleteOption from "../answers/withDeleteOption";
import withCreateExclusive from "../answers/withCreateExclusive";

import AnswersEditor from "../AnswersEditor";
import AnswerTypeSelector from "./AnswerTypeSelector";

import MetaEditor from "./MetaEditor";

import TotalValidation from "../Validation/GroupValidations/TotalValidation";

import {
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
} from "constants/validationMessages";

import ContentContainer from "components/ContentContainer";
import ValidationError from "components/ValidationError";

const ListSegment = styled.div`
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
  list: CustomPropTypes.page.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  fetchAnswers: PropTypes.func.isRequired,
  enableValidationMessage: PropTypes.bool,
};
export const UnwrappedListEditor = (props) => {
  const {
    list,
    list: { id, answers },
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

  // useSetNavigationCallbacksForPage({
  //   page: page,
  //   folder: page?.folder,
  //   section: page?.section,
  // });

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
    <div data-test="list-editor">
      <div>
        <ListSegment id={getIdForObject(page)}>
          <MetaEditor
            onChange={onChange}
            onUpdate={onUpdate}
            page={page}
            fetchAnswers={fetchAnswers}
            enableValidationMessage={enableValidationMessage}
          />
        </ListSegment>

        <AnswersEditor
          answers={answers}
          onUpdate={onUpdateAnswer}
          onAddOption={onAddOption}
          onAddExclusive={onAddExclusive}
          onUpdateOption={onUpdateOption}
          onDeleteOption={onDeleteOption}
          onDeleteAnswer={(answerId) => onDeleteAnswer(id, answerId)}
          data-test="answers-editor"
          list={list}
          metadata={page.section.questionnaire.metadata}
        />
      </div>

      {page.totalValidation && (
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
            <ValidationError>{errorMessages[error.errorCode]}</ValidationError>
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
          list={list}
        />
      </AddAnswerSegment>
    </div>
  );
};

UnwrappedListEditor.propTypes = propTypes;

UnwrappedListEditor.fragments = {
  QuestionPage: gql`
    fragment Lists on Lists {
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
  withUpdateAnswer,
  withCreateAnswer,
  withDeleteAnswer,
  withCreateOption,
  withUpdateOption,
  withDeleteOption,
  withCreateExclusive,
  withPropRenamed("onUpdateListPage", "onUpdate"),
  withEntityEditor("list", UnwrappedListEditor.fragments.Lists),
  withChangeUpdate
)(UnwrappedListEditor);
