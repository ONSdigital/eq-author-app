import React from "react";
import PropTypes from "prop-types";

import { Field } from "components/Forms";
import Label from "components-themed/Label";
import Input from "components-themed/Input";
import Panel from "components-themed/panels";

import { FieldDescription } from "components-themed/Toolkit";

const InputWithConditionalError = ({
  type,
  id,
  title,
  name,
  value,
  description,
  condition,
  handleChange,
  errorMessage,
  dataTest,
  innerRef,
}) => {
  return condition ? (
    <Panel
      variant="errorNoHeader"
      paragraphLabel={errorMessage}
      withLeftBorder
      innerRef={innerRef}
    >
      <Field>
        {description ? (
          <Label htmlFor={id} hasDescription>
            {title}
          </Label>
        ) : (
          <Label htmlFor={id}>{title}</Label>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
        <Input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          data-test={dataTest}
        />
      </Field>
    </Panel>
  ) : (
    <Field>
      {description ? (
        <Label htmlFor={id} hasDescription>
          {title}
        </Label>
      ) : (
        <Label htmlFor={id}>{title}</Label>
      )}
      {description && <FieldDescription>{description}</FieldDescription>}
      <Input
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        data-test={dataTest}
      />
    </Field>
  );
};

InputWithConditionalError.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  description: PropTypes.string,
  condition: PropTypes.bool.isRequired,
  handleChange: PropTypes.func,
  errorMessage: PropTypes.string,
  dataTest: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  innerRef: PropTypes.object,
};

export default InputWithConditionalError;
