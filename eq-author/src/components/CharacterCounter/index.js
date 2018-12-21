import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

const getLength = value => (value ? value.length : 0);

export const Counter = styled.span`
  color: ${props =>
    props.limit - getLength(props.value) < 0 ? colors.red : colors.lightGrey};
  position: absolute;
  top: 1px;
  bottom: 1px;
  right: 1px;
  padding: 0.5em;
  background: white;
`;

const CharacterCounter = ({ value, limit }) => {
  return (
    <Counter value={value} limit={limit}>
      {limit - getLength(value)}
    </Counter>
  );
};

CharacterCounter.propTypes = {
  value: PropTypes.string,
  limit: PropTypes.number.isRequired
};

export default CharacterCounter;
