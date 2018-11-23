import React from "react";
import PropTypes from "prop-types";

import {
  RADIO,
  CHECKBOX,
  TEXTAREA,
  TEXTFIELD,
  DATE,
  TIME,
  DATE_RANGE,
  CURRENCY,
  NUMBER
} from "constants/answer-types";

import DateAnswer from "./DateAnswer";
import DateRangeAnswer from "./DateRangeAnswer";
import MultipleChoiceAnswer from "./MultipleChoiceAnswer";
import CurrencyAnswer from "./CurrencyAnswer";
import DurationAnswer from "./DurationAnswer";
import TextAnswer from "./TextAnswer";
import NumberAnswer from "./NumberAnswer";
import TextAreaAnswer from "./TextAreaAnswer";
import styled from "styled-components";

import { merge, get } from "lodash";
import { connect } from "react-redux";

export const answerComponents = {
  [CHECKBOX]: MultipleChoiceAnswer,
  [RADIO]: MultipleChoiceAnswer,
  [CURRENCY]: CurrencyAnswer,
  [TIME]: DurationAnswer,
  [NUMBER]: NumberAnswer,
  [TEXTFIELD]: TextAnswer,
  [TEXTAREA]: TextAreaAnswer,
  [DATE]: DateAnswer,
  [DATE_RANGE]: DateRangeAnswer
};

const AnswerWrapper = styled.div`
  margin-bottom: 1em;
`;

export const UnwrappedAnswer = ({ answer }) => {
  let Component;
  if (answer.properties.unitType === TIME) {
    Component = answerComponents[answer.properties.unitType];
  } else {
    Component = answerComponents[answer.type];
  }

  return (
    <AnswerWrapper>
      <Component answer={answer} />
    </AnswerWrapper>
  );
};

const mapStateToProps = (state, ownProps) => ({
  answer: merge({}, ownProps.answer, {
    properties: state.answer[ownProps.answer.id]
  })
});

const Answer = connect(mapStateToProps)(UnwrappedAnswer);

Answer.propTypes = {
  answer: PropTypes.shape({
    type: PropTypes.oneOf(Object.keys(answerComponents)).isRequired
  }).isRequired
};

export default Answer;
