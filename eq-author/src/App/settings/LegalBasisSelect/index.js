import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";

import { Input } from "components/Forms";
import { RadioLabel, RadioField, RadioDescription } from "components/Radio";

import UPDATE_QUESTIONNAIRE_MUTATION from "graphql/updateQuestionnaire.graphql";

import LEGAL_BASIS_OPTIONS from "constants/legal-basis-options";

const StyledRadioLabel = styled(RadioLabel)`
  min-width: 22.5em;
  width: fit-content;
`;

const LegalOption = ({ questionnaireId, value, selected, children }) => {
  const [updateQuestionnaire] = useMutation(UPDATE_QUESTIONNAIRE_MUTATION);

  return (
    <StyledRadioLabel selected={selected}>
      <Input
        id={value}
        type="radio"
        variant="radioBox"
        checked={selected}
        onChange={() =>
          updateQuestionnaire({
            variables: { input: { id: questionnaireId, legalBasis: value } },
          })
        }
      />
      {children}
    </StyledRadioLabel>
  );
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

LegalOption.propTypes = {
  questionnaireId: PropTypes.string,
  value: PropTypes.string,
  selected: PropTypes.bool,
  children: PropTypes.node,
};

LegalBasisSelect.propTypes = {
  questionnaireId: PropTypes.string,
  shortName: PropTypes.string,
  selectedLegalBasis: PropTypes.string,
};

export default LegalBasisSelect;
