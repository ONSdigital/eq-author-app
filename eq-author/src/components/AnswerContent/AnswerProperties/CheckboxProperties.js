import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const CheckboxProperties = ({ answer, updateAnswer }) => {
  return <Required answer={answer} updateAnswer={updateAnswer} />;
};

CheckboxProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
};

export default CheckboxProperties;
