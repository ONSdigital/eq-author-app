import React from "react";
import PropTypes from "prop-types";

import {
  RADIO,
  CHECKBOX,
  TEXTAREA,
  TEXTFIELD,
  DATE,
  DATE_RANGE,
  CURRENCY,
  NUMBER
} from "constants/answer-types";

import DateAnswer from "./DateAnswer";
import DateRangeAnswer from "./DateRangeAnswer";
import MultipleChoiceAnswer from "./MultipleChoiceAnswer";
import CurrencyAnswer from "./CurrencyAnswer";
import TextAnswer from "./TextAnswer";
import TextAreaAnswer from "./TextAreaAnswer";
import styled from "styled-components";

export const answerComponents = {
  [CHECKBOX]: MultipleChoiceAnswer,
  [RADIO]: MultipleChoiceAnswer,
  [CURRENCY]: CurrencyAnswer,
  [NUMBER]: TextAnswer,
  [TEXTFIELD]: TextAnswer,
  [TEXTAREA]: TextAreaAnswer,
  [DATE]: DateAnswer,
  [DATE_RANGE]: DateRangeAnswer
};

const AnswerWrapper = styled.div`
  margin-bottom: 1em;
`;

export const Answer = ({ answer }) => {
  const Component = answerComponents[answer.type];
  return (
    <AnswerWrapper>
      <Component answer={answer} />
    </AnswerWrapper>
  );
};
Answer.propTypes = {
  answer: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(answerComponents)).isRequired
  }).isRequired
};
