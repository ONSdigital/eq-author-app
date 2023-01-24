import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const TextFieldProperties = ({
  answer,
  updateAnswer,
  hasMutuallyExclusiveAnswer,
}) => (
  <Required
    answer={answer}
    updateAnswer={updateAnswer}
    hasMutuallyExclusiveAnswer={hasMutuallyExclusiveAnswer}
  />
);

TextFieldProperties.propTypes = {
  updateAnswer: PropTypes.func,
  answer: PropTypes.object, //eslint-disable-line
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

export default TextFieldProperties;
