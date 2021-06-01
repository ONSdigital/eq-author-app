import React from "react";
import PropTypes from "prop-types";

import { Input, Label } from "components/Forms";
import { RadioLabel, RadioField, RadioDescription } from "components/Radio";
import styled from "styled-components";

import useUpdateTheme from "hooks/useUpdateTheme";

const StyledLabel = styled(Label)`
  margin: 0.8em 0 0;
`;

export const LEGAL_BASIS_OPTIONS = [
  {
    description: "Section 1 of the Statistics of Trade Act 1947.",
    value: "NOTICE_1",
  },
  {
    description: "Section 3 and 4 of the Statistics of Trade Act 1947.",
    value: "NOTICE_2",
  },
  {
    description:
      "Article 5 of the Statistics of Trade and Employment (Northern Ireland) Order 1988.",
    value: "NOTICE_NI",
  },
  {
    description: "Voluntary",
    value: "VOLUNTARY",
  },
];

export const LegalOption = ({ name, value, children, onChange, selected }) => (
  <RadioLabel selected={selected}>
    <Input
      type="radio"
      name={name}
      variant="radioBox"
      checked={selected}
      id={value}
      value={value}
      onChange={onChange}
    />
    {children}
  </RadioLabel>
);

LegalOption.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

const LegalBasisSelect = ({
  legalBasis: selectedValue,
  shortName,
  questionnaireId,
}) => {
  const updateTheme = useUpdateTheme();

  const handleChange = ({ value: legalBasisCode }) =>
    updateTheme({
      shortName,
      questionnaireId,
      legalBasisCode,
    });

  return (
    <RadioField>
      <StyledLabel>Legal basis</StyledLabel>
      <p>The legal basis appears on the survey introduction page.</p>
      {LEGAL_BASIS_OPTIONS.map(({ value, description }) => (
        <LegalOption
          name={shortName}
          key={value}
          value={value}
          selected={value === selectedValue}
          onChange={handleChange}
        >
          <RadioDescription>{description}</RadioDescription>
        </LegalOption>
      ))}
    </RadioField>
  );
};

LegalBasisSelect.propTypes = {
  legalBasis: PropTypes.string.isRequired,
  shortName: PropTypes.string.isRequired,
  questionnaireId: PropTypes.string.isRequired,
};

export default LegalBasisSelect;
