import React from "react";
import PropTypes from "prop-types";

import { Input } from "components/Forms";
import {
  RadioLabel,
  RadioField,
  RadioTitle,
  RadioDescription,
} from "components/Radio";

export const LegalOption = ({ name, value, children, onChange, selected }) => (
  <RadioLabel htmlFor={value} selected={selected}>
    <Input
      type="radio"
      variant="radioBox"
      checked={selected}
      name={name}
      id={value}
      value={value}
      onChange={onChange}
    />
    {children}
  </RadioLabel>
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
  <RadioField {...rest}>
    {OPTIONS.map((option) => (
      <LegalOption
        key={option.value}
        name={name}
        value={option.value}
        selected={option.value === value}
        onChange={onChange}
      >
        <RadioTitle>
          {`${option.title} ${
            option.notice ? "- Your response is legally required." : ""
          }`}
        </RadioTitle>
        <RadioDescription>{option.description}</RadioDescription>
      </LegalOption>
    ))}
  </RadioField>
);

LegalBasisField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default LegalBasisField;
