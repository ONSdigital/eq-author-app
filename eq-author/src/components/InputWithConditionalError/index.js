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
  dataTest,
}) => {
  return condition ? (
    <Panel variant="errorNoHeader" paragraphLabel={errorMessage} withLeftBorder>
      <Field>
        <Label htmlFor={id}>{title}</Label>
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
      <Label htmlFor={id}>{title}</Label>
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
  condition: PropTypes.bool.isRequired,
  handleChange: PropTypes.func,
  errorMessage: PropTypes.string,
  dataTest: PropTypes.string,
};

export default InputWithConditionalError;
