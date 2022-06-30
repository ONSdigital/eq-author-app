import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import Popout, { Container, Layer } from "components/Popout";
import IconText from "components/IconText";
import Button from "components/buttons/Button";
import ValidationError from "components/ValidationError";
import { QUESTION_ANSWER_NOT_SELECTED } from "constants/validationMessages";
import { RADIO, MUTUALLY_EXCLUSIVE_OPTION } from "constants/answer-types";

import answersHaveAnswerType from "utils/answersHaveAnswerType";

import { colors } from "constants/theme";

import withValidationError from "enhancers/withValidationError";

import AddIcon from "./icon-add.svg?inline";
import PopupTransition from "./PopupTransition";
import AnswerTypeGrid from "./AnswerTypeGrid";
const _ = require("lodash");

const AddAnswerButton = styled(Button)`
  width: 100%;
  padding: 0.5em;
`;

const PopoutContainer = styled(Container)`
  width: 100%;
`;

const PopoutLayer = styled(Layer)`
  width: 24em;
  right: 0;
  left: 0;
  bottom: 3.5em;
  margin: 0 auto;
  z-index: 10;
`;

const ErrorContext = styled.div`
  position: relative;

  ${(props) =>
    props.isInvalid &&
    css`
      border: 1px solid ${colors.errorPrimary};
      padding: 1em;
    `}
`;

const mutuallyExclusiveEnabled = (answers, hasRadioAnswer) => {
  let allowMutuallyExclusive = false;
  // Mutually exclusive button will be disabled when page has no answers, page has a radio answer, or page already has mutually exclusive answer
  // Does not need to handle date range as "Add an answer" button is disabled when page has a date range answer
  if (
    answers.length === 0 ||
    !answers ||
    hasRadioAnswer ||
    answersHaveAnswerType(answers, MUTUALLY_EXCLUSIVE_OPTION)
  ) {
    allowMutuallyExclusive = false;
  } else {
    allowMutuallyExclusive = true;
  }

  return allowMutuallyExclusive;
};

class AnswerTypeSelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    getValidationError: PropTypes.func.isRequired,
    page: PropTypes.shape({
      answers: PropTypes.array.isRequired,
    }).isRequired,
  };

  state = {
    open: false,
  };

  handleOpenToggle = (open) => {
    this.setState({ open });
  };

  handleSelect = (type) => {
    this.props.onSelect(type);
  };

  saveGridRef = (grid) => {
    this.grid = grid;
  };

  render() {
    const errorValidationMsg = this.props.getValidationError({
      field: "answers",
      message: QUESTION_ANSWER_NOT_SELECTED,
    });
    let hasDateRange = false;
    let hasOtherAnswerType = false;
    let hasRadioAnswer = false;
    let hasMutuallyExclusiveAnswer = false;

    const answers = Array.from(this.props.page.answers);
    const mutuallyExclusive = _.some(answers, (e) => {
      return _.some(e.options, { mutuallyExclusive: true });
    });

    if (this.props.page.answers[0]) {
      if (this.props.page.answers[0].type === "DateRange") {
        hasDateRange = true;
      }
      if (this.props.page.answers[0].type !== "DateRange") {
        hasOtherAnswerType = true;
      }
      if (answersHaveAnswerType(this.props.page.answers, RADIO)) {
        hasRadioAnswer = true;
      }
      if (
        answersHaveAnswerType(
          this.props.page.answers,
          MUTUALLY_EXCLUSIVE_OPTION
        )
      ) {
        hasMutuallyExclusiveAnswer = true;
      }
    }

    const isInvalid = Boolean(errorValidationMsg);
    const trigger = (
      <AddAnswerButton
        variant="secondary"
        data-test="btn-add-answer"
        disabled={hasDateRange || mutuallyExclusive}
      >
        <IconText icon={AddIcon}>
          Add {this.props.page.answers.length === 0 ? "an" : "another"} answer
        </IconText>
      </AddAnswerButton>
    );

    return (
      <>
        <ErrorContext isInvalid={isInvalid}>
          <Popout
            open={this.state.open}
            transition={PopupTransition}
            trigger={trigger}
            container={PopoutContainer}
            layer={PopoutLayer}
            onToggleOpen={this.handleOpenToggle}
          >
            <AnswerTypeGrid
              onSelect={this.handleSelect}
              ref={this.saveGridRef}
              doNotShowDR={hasOtherAnswerType}
              mutuallyExclusiveEnabled={mutuallyExclusiveEnabled(
                this.props.page.answers,
                hasRadioAnswer
              )}
              radioEnabled={!hasMutuallyExclusiveAnswer}
            />
          </Popout>
        </ErrorContext>
        {isInvalid && <ValidationError>{errorValidationMsg}</ValidationError>}
      </>
    );
  }
}

export default withValidationError("page")(AnswerTypeSelector);
