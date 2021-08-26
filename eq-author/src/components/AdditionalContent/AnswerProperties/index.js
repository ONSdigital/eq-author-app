import React from "react";
import CustomPropTypes from "custom-prop-types";
import NumberProperties from "./Answers/NumberProperties";
import UnitProperties from "./Answers/UnitProperties";

const AnswerProperties = (props) => {
  if (["Number", "Currency", "Percentage"].includes(props.answer.type)) {
    return <NumberProperties {...props} />;
  }
  if (["Unit"].includes(props.answer.type)) {
    return <UnitProperties {...props} />;
  }
  return null;
};

AnswerProperties.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
};

export default AnswerProperties;
