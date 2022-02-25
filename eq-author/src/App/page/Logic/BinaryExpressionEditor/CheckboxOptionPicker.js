import React, { useState } from "react";
import styled from "styled-components";
import { includes, get } from "lodash";
import propTypes from "prop-types";

import CustomPropTypes from "custom-prop-types";
import ScrollPane from "components/ScrollPane";
import { Field, Label, Input } from "components/Forms";
import Button from "components/buttons/Button";

const OptionField = styled(Field)`
  margin: 0;
  display: inline-flex;
  max-width: 10em;
  margin-left: 0.5em;
  &:not(:last-of-type) {
    margin-bottom: 0.5em;
  }
`;

const PickerButton = styled(Button)`
  margin: 0.5em;
`;

const OptionLabel = styled(Label)`
  margin: 0 0 0.5em;
  align-items: flex-start;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Title = styled.div`
  font-weight: bold;
  margin-bottom: 1em;
`;

const CheckboxInput = styled(Input).attrs({ type: "checkbox" })`
  flex: 0 0 auto;
  margin-top: 0.1em;
`;

const MutuallyExclusiveOption = styled.div`
  border-top: 1px solid #efefef;
  padding: 0.5em 0 0;
  margin-top: 0.5em 0;
`;
const Scroll = styled(ScrollPane)`
  padding: 0.5em;
  margin: 1em 0;
  max-height: 40vh;
  max-width: 25em;
`;

const Option = ({ option, selected, onChange, label }) => (
  <OptionField key={option.id}>
    <CheckboxInput
      id={`checkbox-${option.id}`}
      name={option.id}
      checked={selected}
      onChange={onChange}
    />
    <OptionLabel htmlFor={`checkbox-${option.id}`}>
      {label || option.label || "Unlabelled option"}
    </OptionLabel>
  </OptionField>
);

Option.propTypes = {
  option: CustomPropTypes.option.isRequired,
  selected: propTypes.bool.isRequired,
  onChange: propTypes.func.isRequired,
  label: propTypes.string,
};

const handler =
  (checkedOptions, setCheckedOptions) =>
  ({ name, value }) => {
    if (value) {
      setCheckedOptions([...checkedOptions, name]);
    } else {
      setCheckedOptions(checkedOptions.filter((id) => id !== name));
    }
  };

const isSelected = (checkedOptions, option) =>
  includes(checkedOptions, option.id);

const CheckboxOptionPicker = ({ expression, onClose, onRightChange }) => {
  const answer = expression.left;
  const selectedOptions = get(expression, "right.options", []).map(
    ({ id }) => id
  );
  const [checkedOptions, setCheckedOptions] = useState(selectedOptions);
  const handleTick = handler(checkedOptions, setCheckedOptions, onClose);
  return (
    <>
      <Title>Choose options</Title>
      <Scroll>
        {answer.options.map((option) => (
          <Option
            key={option.id}
            option={option}
            selected={isSelected(checkedOptions, option)}
            onChange={handleTick}
          />
        ))}
        {answer.mutuallyExclusiveOption && (
          <MutuallyExclusiveOption>
            <Option
              key={answer.mutuallyExclusiveOption.id}
              option={answer.mutuallyExclusiveOption}
              label={`or ${answer.mutuallyExclusiveOption.label}`}
              selected={isSelected(
                checkedOptions,
                answer.mutuallyExclusiveOption
              )}
              onChange={handleTick}
            />
          </MutuallyExclusiveOption>
        )}
      </Scroll>
      <Buttons>
        <PickerButton onClick={onClose} variant="secondary" type="button">
          Cancel
        </PickerButton>
        <PickerButton
          onClick={() => {
            onRightChange({ selectedOptions: checkedOptions });
            onClose();
          }}
          variant="primary"
        >
          Done
        </PickerButton>
      </Buttons>
    </>
  );
};

CheckboxOptionPicker.propTypes = {
  selectedOptions: propTypes.arrayOf(CustomPropTypes.option),
  onClose: propTypes.func.isRequired,
  onRightChange: propTypes.func.isRequired,
  expression: propTypes.shape({
    left: CustomPropTypes.answer.isRequired,
    right: propTypes.shape({
      options: propTypes.arrayOf(CustomPropTypes.option),
    }),
  }),
};

export default CheckboxOptionPicker;
