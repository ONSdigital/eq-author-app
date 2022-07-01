import React from "react";
import { useMutation } from "@apollo/react-hooks";

import PropTypes from "prop-types";
import { flowRight, lowerCase } from "lodash";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";

import withValidationError from "enhancers/withValidationError";

import CREATE_MUTUALLY_EXCLUSIVE from "./graphql/createMutuallyExclusiveOption.graphql";
import DELETE_OPTION from "./graphql/deleteOption.graphql";
import UPDATE_OPTION_MUTATION from "graphql/updateOption.graphql";
import UPDATE_ANSWER from "graphql/updateAnswer.graphql";
import UPDATE_ANSWER_OF_TYPE from "graphql/updateAnswersOfType.graphql";
import answerFragment from "graphql/fragments/answer.graphql";
import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";

import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { TEXTFIELD, MUTUALLY_EXCLUSIVE } from "constants/answer-types";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import AnswerProperties from "components/AnswerContent/AnswerProperties";
import AdvancedProperties from "components/AnswerContent/AdvancedProperties";
import MutuallyExclusive from "components/AnswerContent/MutuallyExclusive";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import InlineField from "components/AnswerContent/Format/InlineField";
import Collapsible from "components/Collapsible";

import gql from "graphql-tag";

const Caption = styled.div`
  margin-bottom: 0.2em;
  font-size: 0.85em;
`;

const CollapsibleContent = styled.p``;

export const StatelessBasicAnswer = ({
  answer,
  onChange,
  onUpdate,
  labelPlaceholder,
  labelText,
  errorLabel,
  descriptionText,
  descriptionPlaceholder,
  showDescription,
  autoFocus,
  getValidationError,
  type,
  optionErrorMsg,
  multipleAnswers,
  page,
}) => {
  const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);

  const [updateAnswer] = useMutation(UPDATE_ANSWER);
  const [updateAnswerOfType] = useMutation(UPDATE_ANSWER_OF_TYPE);
  const [createMutuallyExclusive] = useMutation(CREATE_MUTUALLY_EXCLUSIVE);
  const [updateOption] = useMutation(UPDATE_OPTION_MUTATION);
  const [deleteOption] = useMutation(DELETE_OPTION);

  const { id } = answer;

  return (
    <div>
      <Field>
        <Label htmlFor={`answer-label-${answer.id}`}>{labelText}</Label>
        <WrappingInput
          id={`answer-label-${answer.id}`}
          name="label"
          onChange={onChange}
          onBlur={onUpdate}
          value={answer.label}
          data-autofocus={autoFocus || null}
          placeholder={labelPlaceholder}
          data-test="txt-answer-label"
          bold
          errorValidationMsg={
            optionErrorMsg
              ? optionErrorMsg
              : getValidationError({
                  field: "label",
                  type: "answer",
                  label: errorLabel,
                  requiredMsg: errorMsg,
                })
          }
        />
      </Field>
      {showDescription && (
        <Field>
          <Label htmlFor={`answer-description-${answer.id}`}>
            {descriptionText}
          </Label>
          <WrappingInput
            id={`answer-description-${answer.id}`}
            name="description"
            cols="30"
            rows="5"
            onChange={onChange}
            onBlur={onUpdate}
            value={answer.description}
            placeholder={descriptionPlaceholder}
            data-test="txt-answer-description"
          />
        </Field>
      )}
      {type === MUTUALLY_EXCLUSIVE && (
        <Collapsible title="What is an OR answer?">
          <CollapsibleContent>
            The OR answer type is a mutually exclusive answer. When selected,
            any preceding answers given on the page will be cleared. It will
            appear as a checkbox answer to the respondent unless there is more
            than one OR option, in which case it will display as a Radio answer.
          </CollapsibleContent>
        </Collapsible>
      )}
      <AnswerProperties
        answer={answer}
        updateAnswer={updateAnswer}
        updateAnswerOfType={updateAnswerOfType}
        page={page}
      />
      <AdvancedProperties answer={answer} updateAnswer={updateAnswer}>
        {["Number", "Currency", "Unit", "Percentage"].includes(type) && (
          <>
            <AnswerValidation answer={answer} />
            <InlineField
              id="default-answer"
              htmlFor="default-answer"
              label="Default answer"
            >
              <ToggleSwitch
                id="default-answer"
                name="default-answer"
                hideLabels={false}
                onChange={({ value }) =>
                  updateAnswer({
                    variables: {
                      input: { id, properties: { defaultAnswer: value } },
                    },
                  })
                }
                data-test="default-answer"
                checked={answer.properties.defaultAnswer}
              />
            </InlineField>
            <Caption>
              If unanswered a default value of zero will be recorded.
            </Caption>
            <Collapsible
              title="Why would I need a default value?"
              defaultOpen={false}
              className="default-value"
            >
              <CollapsibleContent>
                If this answer is not provided by the respondent and is used in
                validation settings in a future question it will cause an error.
                Turning on the default answer will prevent this situation from
                arising.
              </CollapsibleContent>
            </Collapsible>
          </>
        )}
        <MutuallyExclusive
          answer={answer}
          createMutuallyExclusive={createMutuallyExclusive}
          disabled={multipleAnswers}
          updateOption={updateOption}
          deleteOption={deleteOption}
          autoFocus={autoFocus}
        />
      </AdvancedProperties>
    </div>
  );
};

StatelessBasicAnswer.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  children: PropTypes.element,
  labelText: PropTypes.string,
  labelPlaceholder: PropTypes.string,
  errorLabel: PropTypes.string,
  descriptionText: PropTypes.string,
  descriptionPlaceholder: PropTypes.string,
  showDescription: PropTypes.bool,
  autoFocus: PropTypes.bool,
  getValidationError: PropTypes.func,
  type: PropTypes.string,
  optionErrorMsg: PropTypes.string,
  multipleAnswers: PropTypes.bool.isRequired,
  page: PropTypes.object, //eslint-disable-line
};

StatelessBasicAnswer.defaultProps = {
  labelText: "Label",
  errorLabel: "Answer label",
  descriptionText: "Description (optional)",
  showDescription: false,
  autoFocus: true,
  getValidationError: () => {},
  type: TEXTFIELD,
};

StatelessBasicAnswer.fragments = {
  Answer: answerFragment,
  BasicAnswer: gql`
    fragment BasicAnswer on BasicAnswer {
      options {
        id
        mutuallyExclusive
        label
        description
      }
      validation {
        ... on NumberValidation {
          minValue {
            enabled
            ...MinValueValidationRule
          }
          maxValue {
            enabled
            ...MaxValueValidationRule
          }
        }
        ... on DateValidation {
          earliestDate {
            enabled
            ...EarliestDateValidationRule
          }
          latestDate {
            enabled
            ...LatestDateValidationRule
          }
        }
        ... on DateRangeValidation {
          earliestDate {
            enabled
            ...EarliestDateValidationRule
          }
          latestDate {
            enabled
            ...LatestDateValidationRule
          }
          minDuration {
            enabled
            ...MinDurationValidationRule
          }
          maxDuration {
            enabled
            ...MaxDurationValidationRule
          }
        }
      }
      validationErrorInfo {
        ...ValidationErrorInfo
      }
    }
    ${MinValueValidationRule}
    ${MaxValueValidationRule}
    ${EarliestDateValidationRule}
    ${LatestDateValidationRule}
    ${ValidationErrorInfoFragment}
    ${MinDurationValidationRule}
    ${MaxDurationValidationRule}
  `,
};

export default flowRight(
  withValidationError("answer"),
  withEntityEditor("answer")
)(StatelessBasicAnswer);
