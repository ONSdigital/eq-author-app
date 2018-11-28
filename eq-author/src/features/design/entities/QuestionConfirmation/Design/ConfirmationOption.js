import PropTypes from "prop-types";
import React from "react";

import DummyMultipleChoice from "components/Answers/Dummy/MultipleChoice";
import {
  StyledOption,
  Flex,
  OptionField
} from "components/Answers/MultipleChoiceAnswer/Option";
import { Label } from "components/Forms";
import WrappingInput from "components/WrappingInput";

import { RADIO } from "constants/answer-types";

const ConfirmationOption = ({ value, name, label, onChange, onUpdate }) => (
  <StyledOption>
    <div>
      <Flex>
        <DummyMultipleChoice type={RADIO} />
        <OptionField>
          <Label htmlFor={`option-label-${name}`}>{label}</Label>
          <WrappingInput
            id={`option-label-${name}`}
            name={`${name}.label`}
            value={value.label}
            placeholder={"Label"}
            onChange={onChange}
            onBlur={onUpdate}
            data-test={`${name}-option-label`}
            bold
          />
        </OptionField>
      </Flex>
      <OptionField>
        <Label htmlFor={`option-description-${name}`}>
          Description (optional)
        </Label>
        <WrappingInput
          id={`option-description-${name}`}
          name={`${name}.description`}
          onChange={onChange}
          value={value.description}
          onBlur={onUpdate}
          data-test={`${name}-option-description`}
        />
      </OptionField>
    </div>
  </StyledOption>
);

ConfirmationOption.propTypes = {
  value: PropTypes.shape({
    label: PropTypes.string,
    description: PropTypes.string
  }).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ConfirmationOption;
