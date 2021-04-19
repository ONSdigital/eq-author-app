import React from "react";
import { Field, Label } from "components/Forms";
import PropTypes from "prop-types";
import { flowRight, lowerCase } from "lodash";
import CustomPropTypes from "custom-prop-types";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import withValidationError from "enhancers/withValidationError";
import answerFragment from "graphql/fragments/answer.graphql";
import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";
import { MISSING_LABEL, ADDITIONAL_LABEL_MISSING, buildLabelError } from "constants/validationMessages";
import gql from "graphql-tag";

import { TEXTFIELD } from "constants/answer-types";

export const StatelessBasicAnswer = ({
  answer,
  onChange,
  onUpdate,
  children,
  labelPlaceholder,
  labelText,
  errorLabel,
  descriptionText,
  descriptionPlaceholder,
  showDescription,
  autoFocus,
  getValidationError,
  type,
}) => {

  console.log('answer :>> ', answer);

  const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);
  // const errorMsgOther = ADDITIONAL_LABEL_MISSING;

  // const labelError = answer.validationErrorInfo?.errors?.find(({ errorCode }) => errorCode === "ERR_VALID_REQUIRED") && errorMsg;
  // const additionalLabelError = answer.validationErrorInfo?.errors?.find(({ errorCode }) => errorCode === "ADDITIONAL_LABEL_MISSING") && errorMsgOther;
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
          // errorValidationMsg={additionalLabelError}
          errorValidationMsg={getValidationError({
            field: "label",
            type: "answer",
            label: errorLabel,
            requiredMsg: errorMsg,
          })}
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
      {children}
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
