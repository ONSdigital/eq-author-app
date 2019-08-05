import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";

import { Input } from "components/Forms";
import { colors } from "constants/theme";

import iconCheck from "./icon-check.svg";

const LegalField = styled.div`
  display: flex;
`;

const LegalInput = styled(Input)`
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  &:hover,
  &:focus {
    border: none;
    outline: none;
    box-shadow: none;
  }
`;

const LegalLabel = styled.label`
  padding: 2.5em 1.5em;
  border-radius: 4px;
  border: 1px solid ${colors.bordersLight};
  flex: 1 1 33.3333333%;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.18);
  color: ${colors.textLight};
  position: relative;
  transition: padding 200ms ease-in-out;

  &:not(:last-of-type) {
    margin-right: 1em;
  }

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }

  &::before {
    content: url(${iconCheck});
    display: inline-block;
    width: 1em;
    height: 1em;
    margin: 0 auto;
    z-index: 1;
    transform: scale(0);
    opacity: 0;
    transition: all 100ms ease-out 100ms;
    margin-top: -1.5em;
    margin-bottom: 0.5em;
  }

  ${props =>
    props.selected &&
    css`
      border: 1px solid ${colors.primary};
      padding: 3em 1.5em 2em;
      &::before {
        transform: scale(1);
        opacity: 1;
      }
    `};
`;

const LegalTitle = styled.span`
  font-size: 0.85em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1em;
  color: ${colors.text};
`;

const LegalNotice = styled.span`
  font-weight: bold;
  margin-bottom: 1em;
  width: 8em;
`;

const LegalDescription = styled.span`
  font-size: 1em;
`;

export const LegalOption = ({ name, value, children, onChange, selected }) => (
  <LegalLabel htmlFor={value} selected={selected}>
    <LegalInput
      type="radio"
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
        <LegalTitle>{option.title}</LegalTitle>
        {option.notice && (
          <LegalNotice>Your response is legally required.</LegalNotice>
        )}
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
