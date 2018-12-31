import React from "react";
import PropTypes from "prop-types";

import DateAnswer from "./DateAnswer";

const DateRangeAnswer = ({ answer }) => {
  const { childAnswers, properties } = answer;
  const [from, to] = childAnswers;

  return (
    <div>
      <DateAnswer answer={{ ...from, properties }} />
      <DateAnswer answer={{ ...to, properties }} />
    </div>
  );
};
DateRangeAnswer.propTypes = {
  answer: PropTypes.shape({
    childAnswers: PropTypes.arrayOf(DateAnswer.propTypes.answer).isRequired,
    properties: PropTypes.shape({
      format: PropTypes.string
    }).isRequired
  })
};

export default DateRangeAnswer;
