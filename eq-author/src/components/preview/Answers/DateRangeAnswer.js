import React from "react";
import PropTypes from "prop-types";

import DateAnswer from "./DateAnswer";

const DateRangeAnswer = ({ answer }) => {
  const { secondaryLabel, ...dateAnswer } = answer;

  return (
    <div>
      <DateAnswer answer={dateAnswer} />
      <DateAnswer
        answer={{
          ...dateAnswer,
          label: secondaryLabel,
        }}
      />
    </div>
  );
};
DateRangeAnswer.propTypes = {
  answer: PropTypes.shape({
    label: PropTypes.string,
    secondaryLabel: PropTypes.string,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }),
};

export default DateRangeAnswer;
