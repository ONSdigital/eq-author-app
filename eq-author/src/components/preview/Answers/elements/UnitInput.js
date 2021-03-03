import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { colors } from "constants/theme";

import Input from "./Input";

const InputType = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 10em;
`;

export const Type = styled.div.attrs(() => ({ "data-test": "unit-type" }))`
  display: inline-block;
  background-color: ${colors.lighterGrey};
  border-left: 1px solid ${colors.grey};
  border-right: 1px solid ${colors.grey};
  border-radius: ${(props) => (props.trailing ? "0 3px 3px 0" : "3px 0 0 3px")};
  padding: 0.6em 1em;
  min-width: 2.9em;
  font-weight: 600;
  font-size: 1em;
  text-align: center;
  line-height: normal;
  position: absolute;
  ${(props) => (props.trailing ? "right" : "left")}: 0;
  top: 1px;
  z-index: 4;
  text-decoration: none;
`;

const InputWithUnit = ({ unit, trailing }) => (
  <InputType>
    <Type trailing={trailing}>{unit}</Type>
    <Input type="text" />
  </InputType>
);

InputWithUnit.propTypes = {
  unit: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  trailing: PropTypes.bool,
};

export default InputWithUnit;
