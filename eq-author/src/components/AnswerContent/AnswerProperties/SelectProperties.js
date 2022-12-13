import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const SelectProperties = ({ answer, updateAnswer }) => {
  return <Required answer={answer} updateAnswer={updateAnswer} />;
};

SelectProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default SelectProperties;
