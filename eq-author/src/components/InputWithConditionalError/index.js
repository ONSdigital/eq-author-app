import React from "react";
import PropTypes from "prop-types";

import { Field } from "components/Forms";
import Label from "components-themed/Label";
import Input from "components-themed/Input";
import Panel from "components-themed/panels";

const InputWithConditionalError = ({
  type,
  id,
  title,
  name,
  value,
  condition,
  handleChange,
  errorMessage,
  htmlFor,
  dataTest,
  autocomplete,
}) => {
  return condition ? (
    <Panel variant="errorNoHeader" paragraphLabel={errorMessage} withLeftBorder>
      <Field>
        <Label htmlFor={htmlFor}>{title}</Label>
        <Input
          type={type}
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          data-test={dataTest}
          autocomplete={autocomplete}
        />
      </Field>
    </Panel>
  ) : (
    <Field>
      <Label htmlFor={htmlFor}>{title}</Label>
      <Input
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        data-test={dataTest}
        autocomplete={autocomplete}
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
  condition: PropTypes.bool.isRequired,
  handleChange: PropTypes.func,
  errorMessage: PropTypes.string,
  htmlFor: PropTypes.string,
  dataTest: PropTypes.string,
  autocomplete: PropTypes.string,
};

export default InputWithConditionalError;
