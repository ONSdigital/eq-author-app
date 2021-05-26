import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import PropTypes from "prop-types";
import updateTheme from "graphql/updateTheme.graphql";
import { Input, Label, Field } from "components/Forms";

const StyledInput = styled(Input)`
  width: 11em;
`;

const FormTypeInput = ({ formType = "", questionnaireId, shortName }) => {
  const [state, setState] = useState(formType);
  const [updateQuestionnaireTheme] = useMutation(updateTheme);

  const handleFormTypeBlur = ({ value }, shortName) => {
    value = value.trim();
    updateQuestionnaireTheme({
      variables: {
        input: { questionnaireId, shortName, formType: value },
      },
    });
  };

  return (
    <StyledInput
      value={state}
      onChange={({ value }) => setState(value)}
      onBlur={(e) => handleFormTypeBlur({ ...e.target }, shortName)}
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
  float: left;
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

export default FormType;
