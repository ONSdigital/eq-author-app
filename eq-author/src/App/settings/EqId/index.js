import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "styled-components";
import PropTypes from "prop-types";
import updateTheme from "graphql/updateTheme.graphql";
import { Input, Field, Label } from "components/Forms";

const StyledInput = styled(Input)`
  width: 11em;
`;

const EqIdInput = ({ eqId = "", questionnaireId, shortName }) => {
  const [state, setState] = useState(eqId);
  const [updateQuestionnaireTheme] = useMutation(updateTheme);

  const handleEQIdBlur = ({ value }, shortName) =>
    updateQuestionnaireTheme({
      variables: {
        input: { questionnaireId, shortName, eqId: value.trim() },
      },
    });

  return (
    <StyledInput
      value={state}
      onChange={({ value }) => setState(value)}
      onBlur={(e) => handleEQIdBlur({ ...e.target }, shortName)}
      data-test={`${shortName}-eq-id-input`}
    />
  );
};

EqIdInput.propTypes = {
  eqId: PropTypes.string,
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string.isRequired,
};

const Container = styled.div`
  float: left;
`;

const EqId = ({ eId, qId, shortName }) => {
  return (
    <Container>
      <Field>
        <Label>eQ ID</Label>
      </Field>
      <EqIdInput eqId={eId} questionnaireId={qId} shortName={shortName} />
    </Container>
  );
};

export default EqId;
