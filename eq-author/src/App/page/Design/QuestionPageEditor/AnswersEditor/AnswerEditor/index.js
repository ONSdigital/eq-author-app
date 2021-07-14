import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import gql from "graphql-tag";
import fp from "lodash/fp";

import CustomPropTypes from "custom-prop-types";

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
} from "constants/answer-types";
import { unitConversion } from "constants/unit-types";
import { durationConversion } from "constants/duration-types";
import Tooltip from "components/Forms/Tooltip";
import DeleteButton from "components/buttons/DeleteButton";
import MoveButton, { IconUp, IconDown } from "components/buttons/MoveButton";

import MultipleChoiceAnswer from "App/page/Design/answers/MultipleChoiceAnswer";
import DateRange from "App/page/Design/answers/DateRange";
import Date from "App/page/Design/answers/Date";
import BasicAnswer from "App/page/Design/answers/BasicAnswer";

const Answer = styled.div`
  border: 1px solid ${colors.bordersLight};
  position: relative;
  background: ${colors.white};
  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
  margin: 0 2em 1em;
`;

const AnswerHeader = styled.div`
  background: ${colors.blue};
  border-bottom: 1px solid ${colors.bordersLight};
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const AnswerTypePanel = styled.span`
  display: flex;
  background: ${colors.darkerBlue};
  color: ${colors.white};
  align-items: center;
`;

const AnswerType = styled.span`
  line-height: 1;
  z-index: 1;
  font-family: Lato, sans-serif;
  font-size: 0.9em;
  letter-spacing: 0;
  font-weight: bold;
  padding-left: 1.6em;
  padding-right: 2em;
`;

const Padding = styled.div`
  padding: 1em 6em 1em 1.5em;
`;

const Buttons = styled.div`
  display: flex;
  z-index: 2;
  button {
    margin-right: 0.2em;
  }
  button:last-of-type {
    margin-right: 0;
  }
`;

class AnswerEditor extends React.Component {
  handleDeleteAnswer = () => {
    this.props.onDeleteAnswer(this.props.answer.id);
  };

  formatIncludes = (x) => fp.flow(fp.get("properties.format"), fp.includes(x));

  renderAnswer(answer) {
    const { type } = answer;
    if ([TEXTFIELD, TEXTAREA].includes(type)) {
      return <BasicAnswer type={type} {...this.props} />;
    }
    if ([PERCENTAGE, NUMBER, CURRENCY, UNIT, DURATION].includes(type)) {
      return <BasicAnswer type={type} {...this.props} showDescription />;
    }
    if (type === CHECKBOX) {
      return <MultipleChoiceAnswer type={type} {...this.props} />;
    }
    if (type === RADIO) {
      return (
        <MultipleChoiceAnswer minOptions={2} type={type} {...this.props} />
      );
    }
    if (type === DATE_RANGE) {
      return <DateRange {...this.props} />;
    }
    // Only option left is Date as validation done in prop types
    return (
      <Date
        {...this.props}
        showDay={this.formatIncludes("dd")(answer)}
        showMonth={this.formatIncludes("mm")(answer)}
        showYear={this.formatIncludes("yyyy")(answer)}
      />
    );
  }

  getAnswerTypeText(answer) {
    if (answer.type === UNIT) {
      if (!answer.properties.unit) {
        return answer.type;
      }
      const unitConfig = unitConversion[answer.properties.unit];
      return (
        <>
          {unitConfig.unit}
          {` (${unitConfig.abbreviation})`}
        </>
      );
    }
    if (answer.type === DURATION) {
      const durationConfig = durationConversion[answer.properties.unit];
      return (
        <>
          {DURATION}
          {` (${durationConfig.abbreviation})`}
        </>
      );
    }
    return answer.type;
  }

  render() {
    return (
      <Answer data-test="answer-editor">
        <AnswerHeader>
          <AnswerTypePanel>
            <AnswerType data-test="answer-type">
              {this.getAnswerTypeText(this.props.answer)} answer
            </AnswerType>
            <Buttons>
              <Tooltip
                content="Move answer up"
                place="top"
                offset={{ top: 0, bottom: 10 }}
              >
                <MoveButton
                  color="white"
                  disabled={!this.props.canMoveUp}
                  onClick={this.props.onMoveUp}
                  data-test="btn-move-answer-up"
                >
                  <IconUp />
                </MoveButton>
              </Tooltip>
              <Tooltip
                content="Move answer down"
                place="top"
                offset={{ top: 0, bottom: 10 }}
              >
                <MoveButton
                  color="white"
                  disabled={!this.props.canMoveDown}
                  onClick={this.props.onMoveDown}
                  data-test="btn-move-answer-down"
                >
                  <IconDown />
                </MoveButton>
              </Tooltip>
              <Tooltip
                content="Delete answer"
                place="top"
                offset={{ top: 0, bottom: 10 }}
              >
                <DeleteButton
                  color="white"
                  size="medium"
                  onClick={this.handleDeleteAnswer}
                  aria-label="Delete answer"
                  data-test="btn-delete-answer"
                />
              </Tooltip>
            </Buttons>
          </AnswerTypePanel>
        </AnswerHeader>

        <Padding>{this.renderAnswer(this.props.answer)}</Padding>
      </Answer>
    );
  }
}

AnswerEditor.propTypes = {
  answer: CustomPropTypes.answer,
  onUpdate: PropTypes.func.isRequired,
  onDeleteAnswer: PropTypes.func.isRequired,
  onAddOption: PropTypes.func.isRequired,
  onAddExclusive: PropTypes.func.isRequired,
  onUpdateOption: PropTypes.func.isRequired,
  onDeleteOption: PropTypes.func.isRequired,
  canMoveDown: PropTypes.bool.isRequired,
  canMoveUp: PropTypes.bool.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
};

AnswerEditor.fragments = {
  AnswerEditor: gql`
    fragment AnswerEditor on Answer {
      ...Answer
      ...MultipleChoice
      ...DateRange
      ...Date
      ...BasicAnswer
    }
    ${BasicAnswer.fragments.Answer}
    ${BasicAnswer.fragments.BasicAnswer}
    ${MultipleChoiceAnswer.fragments.MultipleChoice}
    ${DateRange.fragments.DateRange}
    ${Date.fragments.Date}
  `,
};

export default AnswerEditor;
