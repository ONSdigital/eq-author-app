/* eslint-disable react/no-find-dom-node */
import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import styled from "styled-components";

import { radius } from "constants/theme";
import { IconGrid } from "components/IconGrid";
import AnswerTypeButton from "./AnswerTypeButton";

import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  TEXTAREA,
  CHECKBOX,
  RADIO,
  TIME,
  DATE_RANGE,
  DATE
} from "constants/answer-types";

const Menu = styled.div`
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.16));
  text-align: initial;
  position: relative;
  &::before {
    content: "";
    background: white;
    position: absolute;
    width: 2em;
    height: 2em;
    transform: rotate(45deg);
    bottom: -0.5em;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1;
  }
`;

const MenuBackground = styled.div`
  position: relative;
  z-index: 2;
  background-color: white;
  border-radius: ${radius};
`;

const buttons = [
  { type: CHECKBOX, title: "Checkbox" },
  { type: RADIO, title: "Radio" },
  { type: TEXTFIELD, title: "Text" },
  { type: TEXTAREA, title: "Textarea" },
  { type: CURRENCY, title: "Currency" },
  { type: NUMBER, title: "Number" },
  { type: DATE, title: "Date" },
  { type: DATE_RANGE, title: "Date range" },
  { type: TIME, title: "Time", disabled: true }
];

class AnswerTypeGrid extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    "aria-labelledby": PropTypes.string
  };

  handleSelect = type => {
    this.props.onClose();
    this.props.onSelect(type);
  };

  focusMenuItem = () => {
    findDOMNode(this.button).focus();
  };

  saveButtonRef = button => {
    this.button = button;
  };

  render() {
    const { "aria-labelledby": labelledby, ...otherProps } = this.props;

    return (
      <Menu {...otherProps}>
        <MenuBackground>
          <IconGrid aria-labelledby={labelledby}>
            {buttons.map((button, index) => {
              const props = {
                ...button,
                onClick: this.handleSelect,
                order: buttons.length - index
              };

              if (index === 0) {
                props.ref = this.saveButtonRef;
              }
              return <AnswerTypeButton key={button.type} {...props} />;
            })}
          </IconGrid>
        </MenuBackground>
      </Menu>
    );
  }
}

export default AnswerTypeGrid;
