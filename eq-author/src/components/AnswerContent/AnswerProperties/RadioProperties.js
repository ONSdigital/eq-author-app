import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const RadioProperties = ({ answer, updateAnswer }) => {
  return <Required answer={answer} updateAnswer={updateAnswer} />;
};

RadioProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default RadioProperties;
