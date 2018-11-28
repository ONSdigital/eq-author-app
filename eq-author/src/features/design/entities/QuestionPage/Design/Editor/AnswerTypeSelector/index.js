import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Popout, { Container, Layer } from "components/Popout";

import AnswerTypeGrid from "./AnswerTypeGrid";
import AddIcon from "./icon-add.svg?inline";
import IconText from "components/IconText";
import Button from "components/Button";
import PopupTransition from "./PopupTransition";

const AddAnswerButton = styled(Button)`
  width: 100%;
  padding: 0.5em;
`;

const PopoutContainer = styled(Container)`
  width: 100%;
`;

const PopoutLayer = styled(Layer)`
  width: 22em;
  right: 0;
  left: 0;
  bottom: 3.5em;
  margin: 0 auto;
  z-index: 10;
`;

export default class AnswerTypeSelector extends React.Component {
  static propTypes = {
    onSelect: PropTypes.func.isRequired,
    answerCount: PropTypes.number.isRequired
  };

  state = {
    open: false
  };

  handleOpenToggle = open => {
    this.setState({ open });
  };

  handleSelect = type => {
    this.props.onSelect(type);
  };

  handleEntered = () => {
    this.grid.focusMenuItem();
  };

  saveGridRef = grid => {
    this.grid = grid;
  };

  render() {
    const trigger = (
      <AddAnswerButton variant="secondary" data-test="btn-add-answer">
        <IconText icon={AddIcon}>
          Add {this.props.answerCount === 0 ? "an" : "another"} answer
        </IconText>
      </AddAnswerButton>
    );

    return (
      <Popout
        open={this.state.open}
        transition={PopupTransition}
        trigger={trigger}
        container={PopoutContainer}
        layer={PopoutLayer}
        onToggleOpen={this.handleOpenToggle}
        onEntered={this.handleEntered}
      >
        <AnswerTypeGrid onSelect={this.handleSelect} ref={this.saveGridRef} />
      </Popout>
    );
  }
}
