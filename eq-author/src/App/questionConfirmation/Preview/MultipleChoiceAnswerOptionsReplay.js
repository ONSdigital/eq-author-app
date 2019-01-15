import PropTypes from "prop-types";
import React from "react";

const MultipleChoiceAnswerOptionsReplay = ({ options }) => (
  <ul>
    {options.map(({ id, label }) => (
      <li key={id}>{label}</li>
    ))}
  </ul>
);

MultipleChoiceAnswerOptionsReplay.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default MultipleChoiceAnswerOptionsReplay;
