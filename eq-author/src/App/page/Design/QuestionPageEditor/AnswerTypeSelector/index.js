import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import Popout, { Container, Layer } from "components/Popout";
import IconText from "components/IconText";
import Button from "components/buttons/Button";
import ErrorInline from "components/ErrorInline";
import { QUESTION_ANSWER_NOT_SELECTED } from "constants/validationMessages";

import { colors } from "constants/theme";

import withValidationError from "enhancers/withValidationError";

import AddIcon from "./icon-add.svg?inline";
import PopupTransition from "./PopupTransition";
import AnswerTypeGrid from "./AnswerTypeGrid";

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
  margin-bottom: 1em;

  ${(props) =>
    props.isInvalid &&
    css`
      border: 1px solid ${colors.red};
      padding: 1em;
    `}
`;

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

  handleEntered = () => {
    this.grid.focusMenuItem();
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
    
    let mutuallyExclusive = false;
    // TODO-----------------add this once options from backend is merged in------------------;;;
    // const answers = Array.from(this.props.page.answers);
    // mutuallyExclusive = { ...answers?.options?.some(({ mutuallyExclusive }) => mutuallyExclusive === true)};

    if (this.props.page.answers[0]) {
      if (this.props.page.answers[0].type === "DateRange") {
        hasDateRange = true;
      }
      if (this.props.page.answers[0].type !== "DateRange") {
        hasOtherAnswerType = true;
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
      <ErrorContext isInvalid={isInvalid}>
        <Popout
          open={this.state.open}
          transition={PopupTransition}
          trigger={trigger}
          container={PopoutContainer}
          layer={PopoutLayer}
          onToggleOpen={this.handleOpenToggle}
          onEntered={this.handleEntered}
        >
          <AnswerTypeGrid
            onSelect={this.handleSelect}
            ref={this.saveGridRef}
            doNotShowDR={hasOtherAnswerType}
          />
        </Popout>
        {isInvalid && <ErrorInline>{errorValidationMsg}</ErrorInline>}
      </ErrorContext>
    );
  }
}

export default withValidationError("page")(AnswerTypeSelector);
