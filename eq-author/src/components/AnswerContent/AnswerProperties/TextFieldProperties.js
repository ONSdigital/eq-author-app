import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const TextFieldProperties = ({ answer, updateAnswer }) => (<Required answer={answer} updateAnswer={updateAnswer} />);

TextFieldProperties.propTypes = {
  updateAnswer: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
};

export default TextFieldProperties;
