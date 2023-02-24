import React from "react";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

import styled from "styled-components";

import {
  RadioLabel,
  RadioField,
  RadioDescription as RadioTitle,
} from "components/Radio";
import { Input, Label } from "components/Forms";

import THEMES from "constants/themes";

const StyledRadioTitle = styled(RadioTitle)`
  font-size: 1em;
  letter-spacing: 0;
  margin-left: 2.3em;
  color: ${colors.text};
  margin-bottom: 0.3em;
`;

const RadioDescription = styled.span`
  font-size: 0.8em;
  letter-spacing: 0;
  margin-left: 2.9em;
  color: ${colors.text};
`;

const ThemeOption = ({ title, dataTest, children }) => {
  return (
    <RadioLabel data-test={dataTest}>
      <Input type="radio" variant="radioBox" id="test" value="test" />
      {children}
    </RadioLabel>
  );
};

const ThemeSelect = () => {
  return (
    <RadioField>
      {THEMES.map(({ id, title, description }) => (
        <ThemeOption key={id} dataTest={`theme-option-${id}`}>
          <StyledRadioTitle>{title}</StyledRadioTitle>
          <RadioDescription>{description}</RadioDescription>
        </ThemeOption>
      ))}
    </RadioField>
  );
};

export default ThemeSelect;
