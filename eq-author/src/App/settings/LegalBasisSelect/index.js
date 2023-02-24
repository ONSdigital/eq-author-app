import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";

import { Input } from "components/Forms";
import { RadioLabel, RadioField, RadioDescription } from "components/Radio";

import UPDATE_QUESTIONNAIRE_MUTATION from "graphql/updateQuestionnaire.graphql";

import LEGAL_BASIS_OPTIONS from "constants/legal-basis-options";

const LegalOption = ({ name, value, questionnaireId, selected, children }) => {
  const [updateQuestionnaire] = useMutation(UPDATE_QUESTIONNAIRE_MUTATION);

  return (
    <RadioLabel selected={selected}>
      <Input
        id={value}
        type="radio"
        variant="radioBox"
        name={name}
        checked={selected}
        onChange={() =>
          updateQuestionnaire({
            variables: { input: { id: questionnaireId, legalBasis: value } },
          })
        }
      />
      {children}
    </RadioLabel>
  );
};

LegalOption.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

const LegalBasisSelect = ({
  questionnaireId,
  shortName,
  selectedLegalBasis,
}) => {
  return (
    <RadioField>
      {LEGAL_BASIS_OPTIONS.map(({ value, description }) => (
        <LegalOption
          name={shortName}
          key={value}
          value={value}
          selected={value === selectedLegalBasis}
          questionnaireId={questionnaireId}
        >
          <RadioDescription>{description}</RadioDescription>
        </LegalOption>
      ))}
    </RadioField>
  );
};

LegalBasisSelect.propTypes = {
  questionnaireId: PropTypes.string.isRequired,
  legalBasis: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
};

export default LegalBasisSelect;
