import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const DateRangeProperties = ({ answer, updateAnswer }) => {
  return <Required answer={answer} updateAnswer={updateAnswer} />;
};

DateRangeProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default DateRangeProperties;
