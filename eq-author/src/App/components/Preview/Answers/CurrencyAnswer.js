import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";

import { Field, Input, Label } from "./elements";
import { colors } from "constants/theme";

const InputType = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Type = styled.div`
  display: inline-block;
  background-color: ${colors.lighterGrey};
  border-right: 1px solid ${colors.grey};
  border-radius: 3px 0 0 3px;
  padding: 0.6em 0;
  width: 2.9em;
  font-weight: 600;
  font-size: 1em;
  text-align: center;
  line-height: normal;
  position: absolute;
  left: 1px;
  top: 1px;
  z-index: 4;
  text-decoration: none;
`;

const CurrencyAnswer = ({ answer }) => (
  <Field>
    <Label description={answer.description}>{answer.label}</Label>
    <InputType>
      <Type>£</Type>
      <Input type="text" />
    </InputType>
  </Field>
);

CurrencyAnswer.propTypes = {
  answer: PropTypes.shape({
    description: PropTypes.string,
    label: PropTypes.string
  }).isRequired
};

export default CurrencyAnswer;
