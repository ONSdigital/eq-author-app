import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import updateTheme from "graphql/updateTheme.graphql";
import { Input, Label, Field } from "components/Forms";
import ValidationError from "components/ValidationError";
import { THEME_ERROR_MESSAGES } from "constants/validationMessages";

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

const FormType = ({
  formType,
  questionnaireId,
  shortName,
  validationErrorInfo,
}) => {
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
      {validationErrorInfo.errors.map(
        ({ errorCode }, index) =>
          errorCode === "ERR_FORM_TYPE_FORMAT" && (
            <ValidationError key={index} right>
              {THEME_ERROR_MESSAGES.ERR_FORM_TYPE_FORMAT}
            </ValidationError>
          )
      )}
    </Container>
  );
};

FormType.propTypes = {
  formType: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
  validationErrorInfo: CustomPropTypes.validationErrorInfo,
};

export default FormType;
