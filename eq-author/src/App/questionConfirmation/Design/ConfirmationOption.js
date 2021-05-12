import PropTypes from "prop-types";
import React from "react";
import DummyMultipleChoice from "App/page/Design/answers/dummy/MultipleChoice";
import {
  StyledOption,
  Flex,
  OptionField,
} from "App/page/Design/answers/MultipleChoiceAnswer/Option";
import { Label } from "components/Forms";
import WrappingInput from "components/Forms/WrappingInput";

import { RADIO } from "constants/answer-types";
import { CONFIRMATION_OPTION } from "constants/validation-error-types";

import withValidationError from "enhancers/withValidationError";

export const UnwrappedConfirmationOption = ({
  value,
  name,
  label,
  onChange,
  onUpdate,
  getValidationError,
}) => (
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
            placeholder={""}
            onChange={onChange}
            onBlur={onUpdate}
            data-test={`${name}-option-label`}
            bold
            // errorValidationMsg={getValidationError({
            //   field: "label",
            //   label: "Confirmation label",
            //   requiredMsg: `Enter ${label.toLowerCase()}`,
            // })}
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

UnwrappedConfirmationOption.propTypes = {
  value: PropTypes.shape({
    label: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  getValidationError: PropTypes.func.isRequired,
};

export default withValidationError(CONFIRMATION_OPTION)(
  UnwrappedConfirmationOption
);
