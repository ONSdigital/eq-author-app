import React, { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import useUpdateTheme from "hooks/useUpdateTheme";
import { Input, Field, Label } from "components/Forms";

const StyledInput = styled(Input)`
  width: 11em;
`;

const EqIdInput = ({ eqId = "", questionnaireId, shortName }) => {
  const [value, setValue] = useState(eqId);
  const updateTheme = useUpdateTheme();

  const handleBlur = () =>
    updateTheme({
      questionnaireId,
      shortName,
      eqId: value,
    });

  return (
    <StyledInput
      value={value}
      onChange={({ value }) => setValue(value)}
      onBlur={handleBlur}
      data-test={`${shortName}-eq-id-input`}
    />
  );
};

EqIdInput.propTypes = {
  eqId: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

const Container = styled.div``;

const EqId = ({ eqId, questionnaireId, shortName }) => {
  return (
    <Container>
      <Field>
        <Label>eQ ID</Label>
      </Field>
      <EqIdInput
        eqId={eqId}
        questionnaireId={questionnaireId}
        shortName={shortName}
      />
    </Container>
  );
};

EqId.propTypes = {
  eqId: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

export default EqId;
