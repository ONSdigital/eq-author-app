import React from "react";
import PropTypes from "prop-types";
import Required from "components/AnswerContent/Required";

const SelectProperties = ({
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

SelectProperties.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  updateAnswer: PropTypes.func,
  hasMutuallyExclusiveAnswer: PropTypes.bool,
};

export default SelectProperties;
