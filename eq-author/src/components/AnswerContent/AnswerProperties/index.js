import React from "react";
import CustomPropTypes from "custom-prop-types";
import NumberProperties from "./Answers/NumberProperties";
import UnitProperties from "./Answers/UnitProperties";
import DurationProperties from "./Answers/DurationProperties";
import TextFieldProperties from "./Answers/TextFieldProperties";
import TextAreaProperties from "./Answers/TextAreaProperties";
import DateProperties from "./Answers/DateProperties";
import DateRangeProperties from "./Answers/DateRangeProperties";
import RadioProperties from "./Answers/RadioProperties";
import CheckboxProperties from "./Answers/CheckboxProperties";
import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  TEXTAREA,
  CHECKBOX,
  RADIO,
  DATE_RANGE,
  UNIT,
  DURATION,
  DATE,
} from "constants/answer-types";

const AnswerProperties = (props) => {
  if ([NUMBER, CURRENCY, PERCENTAGE].includes(props.answer.type)) {
    return <NumberProperties {...props} />;
  }
  if ([UNIT].includes(props.answer.type)) {
    return <UnitProperties {...props} />;
  }
  if ([DURATION].includes(props.answer.type)) {
    return <DurationProperties {...props} />;
  }
  if ([TEXTFIELD].includes(props.answer.type)) {
    return <TextFieldProperties {...props} />;
  }
  if ([TEXTAREA].includes(props.answer.type)) {
    return <TextAreaProperties {...props} />;
  }
  if ([DATE].includes(props.answer.type)) {
    return <DateProperties {...props} />;
  }
  if ([DATE_RANGE].includes(props.answer.type)) {
    return <DateRangeProperties {...props} />;
  }
  if ([RADIO].includes(props.answer.type)) {
    return <RadioProperties {...props} />;
  }
  if ([CHECKBOX].includes(props.answer.type)) {
    return <CheckboxProperties {...props} />;
  }

  return null;
};

AnswerProperties.propTypes = {
  answer: CustomPropTypes.answer.isRequired,
};

export default AnswerProperties;
