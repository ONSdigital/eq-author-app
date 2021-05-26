import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/react-hooks";

import styled from "styled-components";
import PropTypes from "prop-types";
import { flowRight, lowerCase } from "lodash";
import CustomPropTypes from "custom-prop-types";

import { Field, Label } from "components/Forms";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import DummyMultipleChoice from "../dummy/MultipleChoice";

import {
  StyledOption,
  Flex,
  OptionField,
} from "App/page/Design/answers/MultipleChoiceAnswer/Option";
import withValidationError from "enhancers/withValidationError";

import CREATE_MUTUALLY_EXCLUSIVE from "./graphql/createMutuallyExclusiveOption.graphql";
import DELETE_OPTION from "./graphql/deleteOption.graphql";
import UPDATE_OPTION_MUTATION from "graphql/updateOption.graphql";

import answerFragment from "graphql/fragments/answer.graphql";
import MinValueValidationRule from "graphql/fragments/min-value-validation-rule.graphql";
import MaxValueValidationRule from "graphql/fragments/max-value-validation-rule.graphql";
import EarliestDateValidationRule from "graphql/fragments/earliest-date-validation-rule.graphql";
import LatestDateValidationRule from "graphql/fragments/latest-date-validation-rule.graphql";
import ValidationErrorInfoFragment from "graphql/fragments/validationErrorInfo.graphql";
import MinDurationValidationRule from "graphql/fragments/min-duration-validation-rule.graphql";
import MaxDurationValidationRule from "graphql/fragments/max-duration-validation-rule.graphql";
import { MISSING_LABEL, buildLabelError } from "constants/validationMessages";
import { TEXTFIELD, CHECKBOX } from "constants/answer-types";

import gql from "graphql-tag";

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

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
  optionErrorMsg,
  multipleAnswers,
}) => {
  const errorMsg = buildLabelError(MISSING_LABEL, `${lowerCase(type)}`, 8, 7);
  const getMutuallyExclusive = ({ options }) =>
    options?.find(({ mutuallyExclusive }) => mutuallyExclusive === true);

  const [createMutuallyExclusive] = useMutation(CREATE_MUTUALLY_EXCLUSIVE);
  const [updateOption] = useMutation(UPDATE_OPTION_MUTATION);
  const [deleteOption] = useMutation(DELETE_OPTION);

  const [mutuallyExclusiveLabel, setMutuallyExclusiveLabel] = useState("");

  useEffect(() => {
    const { label } = getMutuallyExclusive(answer) || { label: "" };
    setMutuallyExclusiveLabel(label);
  }, [answer]);

  const onChangeToggle = () => {
    const { id } = getMutuallyExclusive(answer) || {};
    if (!id) {
      createMutuallyExclusive({
        variables: { input: { answerId: answer.id, label: "" } },
      });
    } else {
      deleteOption({ variables: { input: { id } } });
    }
  };

  const onUpdateOption = (label) => {
    const { id } = getMutuallyExclusive(answer) || {};

    updateOption({ variables: { input: { id, label } } });
  };

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
      {type === "Percentage" && (
        <ToggleWrapper data-test="toggle-wrapper" disabled={multipleAnswers}>
          <InlineField>
            <Label>{`"Or" option`}</Label>
            <ToggleSwitch
              id="toggle-or-option"
              name="toggle-or-option"
              hideLabels={false}
              onChange={onChangeToggle}
              checked={getMutuallyExclusive(answer) && !multipleAnswers}
              data-test="toggle-or-option"
            />
          </InlineField>
        </ToggleWrapper>
      )}
      {getMutuallyExclusive(answer) && !multipleAnswers && (
        <StyledOption>
          <Flex>
            <DummyMultipleChoice type={CHECKBOX} />
            <OptionField>
              <Label htmlFor={`option-label-${answer.id}`}>{"Label"}</Label>
              <WrappingInput
                id={`option-label-${answer.id}`}
                name="label"
                value={mutuallyExclusiveLabel}
                placeholder={labelPlaceholder}
                onChange={({ value }) => setMutuallyExclusiveLabel(value)}
                onBlur={({ target: { value } }) => onUpdateOption(value)}
                data-test="option-label"
                data-autofocus={autoFocus || null}
                bold
              />
            </OptionField>
          </Flex>
          <OptionField>
            <Label htmlFor={`option-description-${answer.id}`}>
              Description (optional)
            </Label>
            <WrappingInput
              id={`option-description-${answer.id}`}
              name="description"
              value={answer.description}
              placeholder={descriptionPlaceholder}
              onChange={onChange}
              onBlur={onUpdate}
              data-test="option-description"
            />
          </OptionField>
        </StyledOption>
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
  optionErrorMsg: PropTypes.string,
  multipleAnswers: PropTypes.bool.isRequired,
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
