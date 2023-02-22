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
import { TEXTFIELD, TEXTAREA, DURATION } from "constants/answer-types";
import { ANSWER } from "components/ContentPickerSelectv3/content-types";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";
import AnswerProperties from "components/AnswerContent/AnswerProperties";
import AdvancedProperties from "components/AnswerContent/AdvancedProperties";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import InlineField from "components/AnswerContent/Format/InlineField";
import Collapsible from "components/Collapsible";

import gql from "graphql-tag";
import RichTextEditor from "components/RichTextEditor";

const Caption = styled.div`
  margin-bottom: 0.2em;
  font-size: 0.85em;
`;

const CollapsibleContent = styled.p``;

const answersWithoutAdditionalProperties = [TEXTFIELD, TEXTAREA, DURATION];

export const StatelessBasicAnswer = ({
  answer,
  onChange,
  onUpdate,
  labelText,
  errorLabel,
  descriptionText,
  descriptionPlaceholder,
  showDescription,
  getValidationError,
  type,
  page,
}) => {
  const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);

  const [updateAnswer] = useMutation(UPDATE_ANSWER);
  const [updateAnswerOfType] = useMutation(UPDATE_ANSWER_OF_TYPE);

  const { id } = answer;
  const pipingControls = { piping: true };
  const errorMessage = getValidationError({
    field: "label",
    type: "answer",
    label: errorLabel,
    requiredMsg: errorMsg,
  });

  return (
    <div>
      <Field>
        <RichTextEditor
          id={`answer-label-${answer.id}`}
          label={labelText}
          name="label"
          value={answer?.label}
          onUpdate={({ value }) =>
            updateAnswer({
              variables: {
                input: { id, label: value },
              },
            })
          }
          data-test="txt-answer-label"
          controls={pipingControls}
          size="large"
          allowableTypes={[ANSWER]}
          errorValidationMsg={!answer.label ? errorMessage : ""}
          autoFocus={!answer.label}
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
      <AnswerProperties
        answer={answer}
        updateAnswer={updateAnswer}
        updateAnswerOfType={updateAnswerOfType}
        page={page}
      />
      {!answersWithoutAdditionalProperties.includes(type) && (
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
                  If this answer is not provided by the respondent and is used
                  in validation settings in a future question it will cause an
                  error. Turning on the default answer will prevent this
                  situation from arising.
                </CollapsibleContent>
              </Collapsible>
            </>
          )}
        </AdvancedProperties>
      )}
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
