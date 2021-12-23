import PropTypes from "prop-types";
import React from "react";
import styled, { css } from "styled-components";

import { CHECKBOX, RADIO } from "constants/answer-types";
import { Field } from "./elements";
import { colors } from "constants/theme";

const Legend = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const radioInput = css`
  border-radius: 100px;
  box-shadow: inset 0 0 0 3px #fff;
`;

const inputWithError = css`
  border-color: ${colors.previewError} !important;
  background-color: ${colors.previewError} !important;
  box-shadow: none;
`;

export const Input = styled.input`
  width: 20px;
  height: 20px;
  appearance: none;
  border: 1px solid #9b9b9b;
  padding: 0.5em;
  background: #eee;
  box-shadow: inset 0 0 0 3px white;
  pointer-events: none;
  position: absolute;
  top: 1em;
  left: 1em;

  ${(props) => props.type === RADIO && radioInput};
  ${(props) => props.error && inputWithError};
`;

const OptionLabel = styled.label`
  display: block;
  font-size: 1em;
  color: inherit;
  line-height: 1.4;
  font-weight: inherit;
  padding: 0.7em 1em 0.7em 2.5em;
  margin: 0;
`;

const OptionDescription = styled.div`
  font-size: 0.8em;
  margin-top: 0.5em;
  color: ${colors.text};
`;

const optionItemError = css`
  border: 2px dashed ${colors.previewError};
  color: ${colors.secondary};
  font-weight: bold;
`;

export const OptionItem = styled.div`
  font-size: 1em;
  background: #fff;
  border: 1px solid ${colors.grey};
  border-radius: 0.2em;
  width: fit-content;
  min-width: 20em;
  max-width: 100%;
  display: block;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.25em;
  word-wrap: break-word;

  ${(props) => props.error && optionItemError};
`;

const SelectAll = styled.div`
  margin-bottom: 0.5em;
`;

const OtherLabel = styled.div`
  margin-bottom: 0.5em;
  font-size: 0.8em;
  font-weight: inherit;
`;

const TextInput = styled.input`
  padding: 0.6em;
  display: block;
  color: inherit;
  font-size: 1em;
  border: 1px solid ${colors.grey};
  border-radius: 3px;
  width: 100%;
`;

const OtherField = styled.div`
  padding: 0 0.5em 0.5em;
`;

const MutuallyExclusiveOption = styled.div`
  margin-top: 1em;
`;

const MutuallyExclusiveOptionTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.5em;
`;

const OptionPropType = PropTypes.shape({
  id: PropTypes.string,
  label: PropTypes.string,
  description: PropTypes.string,
});

export const Option = ({ option, type, answer }) => (
  <OptionItem error={!option.label}>
    <Input type={type} error={!option.label} />
    <OptionLabel>
      {option.label || "Missing label"}
      {option.description && (
        <OptionDescription>{option.description}</OptionDescription>
      )}
    </OptionLabel>
    {answer && (
      <OtherField>
        <OtherLabel>{answer.label}</OtherLabel>
        <TextInput type="text" />
      </OtherField>
    )}
  </OptionItem>
);
Option.propTypes = {
  option: OptionPropType.isRequired,
  type: PropTypes.string.isRequired,
  answer: PropTypes.shape({
    label: PropTypes.string,
  }),
};

const MultipleChoiceAnswer = ({ answer }) => {
  return (
    <Field>
      <Legend>
        {answer.options[0].mutuallyExclusive ? "Or" : answer.label}
      </Legend>
      {answer.type === CHECKBOX && !answer.label && (
        <SelectAll>Select all that apply:</SelectAll>
      )}
      {answer.options.map((option, index) => (
        <Option
          key={option.id || index}
          option={option}
          type={answer.type}
          answer={option.additionalAnswer}
        />
      ))}
      {answer.mutuallyExclusiveOption && (
        <MutuallyExclusiveOption>
          <MutuallyExclusiveOptionTitle>Or</MutuallyExclusiveOptionTitle>
          <Option option={answer.mutuallyExclusiveOption} type={answer.type} />
        </MutuallyExclusiveOption>
      )}
    </Field>
  );
};

MultipleChoiceAnswer.propTypes = {
  answer: PropTypes.shape({
    type: PropTypes.string.isRequired,
    label: PropTypes.string,
    other: PropTypes.shape({
      option: OptionPropType,
      answer: Option.propTypes.answer,
    }),
    options: PropTypes.arrayOf(OptionPropType).isRequired,
    mutuallyExclusiveOption: OptionPropType,
  }).isRequired,
};

export default MultipleChoiceAnswer;
