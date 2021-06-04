import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useUpdateTheme from "hooks/useUpdateTheme";
import { Input, Label, Field } from "components/Forms";

const StyledInput = styled(Input)`
  width: 11em;
`;

const FormTypeInput = ({ formType = "", questionnaireId, shortName }) => {
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
      value={value}
      onChange={({ value }) => setValue(value)}
      onBlur={handleBlur}
      data-test={`${shortName}-form-type-input`}
    />
  );
};

FormTypeInput.propTypes = {
  formType: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

const Container = styled.div`
  margin-left: 1em;
`;

const FormType = ({ formType, questionnaireId, shortName }) => {
  return (
    <Container>
      <Field>
        <Label>Form type</Label>
      </Field>
      <FormTypeInput
        formType={formType}
        questionnaireId={questionnaireId}
        shortName={shortName}
      />
    </Container>
  );
};

FormType.propTypes = {
  formType: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

export default FormType;
