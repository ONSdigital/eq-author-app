import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import gql from "graphql-tag";
import styled from "styled-components";
import { flowRight } from "lodash";
import { useMutation } from "@apollo/react-hooks";

import answerFragment from "graphql/fragments/answer.graphql";
import CREATE_MUTUALLY_EXCLUSIVE from "../BasicAnswer/graphql/createMutuallyExclusiveOption.graphql";
import DELETE_OPTION from "../BasicAnswer/graphql/deleteOption.graphql";
import UPDATE_OPTION_MUTATION from "graphql/updateOption.graphql";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";
import withEntityEditor from "components/withEntityEditor";
import VisuallyHidden from "components/VisuallyHidden";
import ToggleSwitch from "components/buttons/ToggleSwitch";
import {
  StyledOption,
  Flex,
  OptionField,
} from "App/page/Design/answers/MultipleChoiceAnswer/Option";
import DummyMultipleChoice from "../dummy/MultipleChoice";

import { colors } from "constants/theme";
import { DATE_LABEL_REQUIRED } from "constants/validationMessages";
import { CHECKBOX } from "constants/answer-types";

import DummyDate from "../dummy/Date";
import withValidationError from "enhancers/withValidationError";

const Format = styled.div`
  padding: 1em;
  width: 66.66%;
  border-radius: 3px;
  opacity: 0.5 !important;
  border: 1px solid ${colors.bordersLight};
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
`;

const ToggleWrapper = styled.div`
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;

  > * {
    margin-bottom: 0;
  }
`;

const Legend = VisuallyHidden.withComponent("legend");

export const UnwrappedDate = ({
  label,
  name,
  answer,
  onChange,
  onUpdate,
  placeholder,
  showDay,
  showMonth,
  showYear,
  errorLabel,
  getValidationError,
  multipleAnswers,
  labelPlaceholder,
  autoFocus,
  descriptionPlaceholder,
  disableMutuallyExclusive,
}) => {
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
    <Fieldset>
      <Legend>Date options</Legend>
      <Field>
        <Label htmlFor={`${name}-${answer.id}`}>{label}</Label>
        <WrappingInput
          id={`${name}-${answer.id}`}
          name={name}
          size="medium"
          onChange={onChange}
          onBlur={onUpdate}
          value={answer[name]}
          placeholder={placeholder}
          data-test="date-answer-label"
          data-autofocus
          bold
          errorValidationMsg={getValidationError({
            field: name,
            label: errorLabel,
            requiredMsg: DATE_LABEL_REQUIRED,
          })}
        />
      </Field>
      <Field>
        <Label>Date</Label>
        <Format>
          <DummyDate
            showDay={showDay}
            showMonth={showMonth}
            showYear={showYear}
          />
        </Format>
      </Field>
      {!disableMutuallyExclusive && (
        <ToggleWrapper data-test="toggle-wrapper" disabled={multipleAnswers}>
          <InlineField>
            <Label htmlFor="toggle-or-option">{`"Or" option`}</Label>
            <ToggleSwitch
              id="toggle-or-option-date"
              name="toggle-or-option-date"
              hideLabels={false}
              onChange={onChangeToggle}
              checked={getMutuallyExclusive(answer) && !multipleAnswers}
              data-test="toggle-or-option-date"
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
    </Fieldset>
  );
};

UnwrappedDate.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  answer: propType(answerFragment),
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  errorLabel: PropTypes.string,
  showDay: PropTypes.bool,
  showMonth: PropTypes.bool,
  showYear: PropTypes.bool,
  getValidationError: PropTypes.func,
  multipleAnswers: PropTypes.bool.isRequired,
  labelPlaceholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  descriptionPlaceholder: PropTypes.string,
  disableMutuallyExclusive: PropTypes.bool,
};

UnwrappedDate.defaultProps = {
  label: "Label",
  name: "label",
};

UnwrappedDate.fragments = {
  Date: gql`
    fragment Date on Answer {
      id
      label
      properties
      ... on BasicAnswer {
        options {
          id
          mutuallyExclusive
          label
        }
      }
    }
  `,
};

export default flowRight(
  withEntityEditor("answer"),
  withValidationError("answer")
)(UnwrappedDate);
