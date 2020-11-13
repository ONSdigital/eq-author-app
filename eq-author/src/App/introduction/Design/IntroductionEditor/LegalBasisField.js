import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";
import { Input } from "components/Forms";

const LegalField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const LegalLabel = styled.label`
  padding: 2.5em 1.5em;
  border-radius: 0.25em;
  margin-bottom: 1.25em;
  border: 1px solid ${colors.bordersLight};
  flex: 1 1 33.3333333%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.18);
  color: ${colors.textLight};
  position: relative;
  transition: padding 200ms ease-in-out;

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
`;

const LegalTitle = styled.span`
  font-weight: bold;
  letter-spacing: 0;
  margin-left: 3em;
  color: ${colors.text};
  display: flex;
  margin-top: -1em;
`;

const LegalDescription = styled.span`
  font-size: 1em;
  letter-spacing: 0;
  margin-left: 3em;
  margin-bottom: -1em;
`;

export const LegalOption = ({ name, value, children, onChange, selected }) => (
  <LegalLabel htmlFor={value} selected={selected}>
    <Input
      type="radio"
      variant="radioBox"
      name={name}
      id={value}
      value={value}
      onChange={onChange}
    />
    {children}
  </LegalLabel>
);
LegalOption.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

const OPTIONS = [
  {
    title: "Notice 1",
    notice: true,
    description:
      "Notice is given under section 1 of the Statistics of Trade Act 1947.",
    value: "NOTICE_1",
  },
  {
    title: "Notice 2",
    notice: true,
    description:
      "Notice is given under sections 3 and 4 of the Statistics of Trade Act 1947.",
    value: "NOTICE_2",
  },
  {
    title: "Voluntary",
    description: "No legal notice will be displayed.",
    value: "VOLUNTARY",
  },
];

const LegalBasisField = ({ name, value, onChange, ...rest }) => (
  <LegalField {...rest}>
    {OPTIONS.map(option => (
      <LegalOption
        key={option.value}
        name={name}
        value={option.value}
        selected={option.value === value}
        onChange={onChange}
      >
        <LegalTitle>
          {option.title +
            (option.notice ? " - Your response is legally required." : "")}
        </LegalTitle>
        <LegalDescription>{option.description}</LegalDescription>
      </LegalOption>
    ))}
  </LegalField>
);

LegalBasisField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LegalBasisField;
