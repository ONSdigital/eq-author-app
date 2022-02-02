import React from "react";

import { Field } from "components/Forms";
import Label from "components-themed/Label";
import Input from "components-themed/Input";
import Panel from "components-themed/panels";

const AccountCreation = ({
  id,
  title,
  name,
  value,
  condition,
  handleChange,
  errorMessage,
  htmlFor,
  dataTest,
}) => {
  return condition ? (
    <Panel variant="errorNoHeader" paragraphLabel={errorMessage} withLeftBorder>
      <Field>
        <Label htmlFor={htmlFor}>{title}</Label>
        <Input
          type="text"
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          data-test={dataTest}
          // autocomplete="off"
        />
      </Field>
    </Panel>
  ) : (
    <Field>
      <Label htmlFor={htmlFor}>{title}</Label>
      <Input
        type="text"
        id={id}
        value={value}
        onChange={handleChange}
        data-test={dataTest}
        // autocomplete="off"
      />
    </Field>
  );
};

export default AccountCreation;
