import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useUpdateTheme from "hooks/useUpdateTheme";
import { Input, Label, Field } from "components/Forms";
import ValidationError from "components/ValidationError";
import { THEME_ERROR_MESSAGES } from "constants/validationMessages";

const StyledInput = styled(Input)`
  width: 11em;
`;

const renderThemeErrors = (errors) =>
  errors.map(({ errorCode }, index) => (
    <ValidationError key={index}>
      {THEME_ERROR_MESSAGES[errorCode]}
    </ValidationError>
  ));

const FormTypeInput = ({ id, formType = "", questionnaireId, shortName }) => {
  const [value, setValue] = useState(formType);
  const updateTheme = useUpdateTheme();

  const handleBlur = () => {
    updateTheme({
      questionnaireId,
      shortName,
      formType: value,
    });
  };

  return (
    <StyledInput
      id={id}
      value={value}
      onChange={({ value }) => setValue(value)}
      onBlur={handleBlur}
      data-test={`${shortName}-form-type-input`}
    />
  );
};

FormTypeInput.propTypes = {
  id: PropTypes.string,
  formType: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

const Container = styled.div`
  margin-left: 1em;
`;

const FormType = ({ formType, questionnaireId, shortName, errors }) => {
  return (
    <Container>
      <Field>
        <Label htmlFor="formType">Form type</Label>
      </Field>
      <FormTypeInput
        id="formType"
        formType={formType}
        questionnaireId={questionnaireId}
        shortName={shortName}
      />
      {renderThemeErrors(errors)}
    </Container>
  );
};

FormType.propTypes = {
  formType: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
  errors: PropTypes.array, //eslint-disable-line
};

export default FormType;
