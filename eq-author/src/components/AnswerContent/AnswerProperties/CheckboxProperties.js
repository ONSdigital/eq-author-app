import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const CheckboxProperties = ({
  answer,
  updateAnswer,
  hasMutuallyExclusiveAnswer,
}) => {
  return (
    <Required
      answer={answer}
      updateAnswer={updateAnswer}
      hasMutuallyExclusiveAnswer={hasMutuallyExclusiveAnswer}
    />
  );
};

CheckboxProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

export default CheckboxProperties;
