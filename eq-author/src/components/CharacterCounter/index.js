import React from "react";
import PropTypes from "prop-types";

const getLength = value => (value ? value.length : 0);

const CharacterCounter = ({ value, limit }) => (
  <span>Characters remaining: {limit - getLength(value)}</span>
);

CharacterCounter.propTypes = {
  value: PropTypes.string,
  limit: PropTypes.number.isRequired
};

export default CharacterCounter;
