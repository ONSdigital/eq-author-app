import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { radius } from "constants/theme";
import { IconGrid } from "components/IconGrid";
import AnswerTypeButton from "./AnswerTypeButton";

import {
  NUMBER,
  CURRENCY,
  UNIT,
  PERCENTAGE,
  DURATION,
  DATE,
  DATE_RANGE,
  TEXTAREA,
  TEXTFIELD,
  RADIO,
  CHECKBOX,
  MUTUALLY_EXCLUSIVE_OPTION,
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

export const buttons = [
  { type: NUMBER, title: "Number" },
  { type: CURRENCY, title: "Currency" },
  { type: UNIT, title: "Unit" },
  { type: PERCENTAGE, title: "Percentage" },
  { type: DURATION, title: "Duration" },
  { type: DATE, title: "Date" },
  { type: DATE_RANGE, title: "Date range" },
  { type: TEXTAREA, title: "Textarea" },
  { type: TEXTFIELD, title: "Text" },
  { type: RADIO, title: "Radio" },
  { type: CHECKBOX, title: "Checkbox" },
  { type: MUTUALLY_EXCLUSIVE_OPTION, title: "OR answer" },
];

class AnswerTypeGrid extends React.Component {
  static propTypes = {
    onClose: PropTypes.func,
    onSelect: PropTypes.func.isRequired,
    "aria-labelledby": PropTypes.string,
    doNotShowDR: PropTypes.bool,
    mutuallyExclusiveEnabled: PropTypes.bool,
  };

  handleSelect = (type) => {
    this.props.onClose();
    this.props.onSelect(type);
  };

  saveButtonRef = (button) => {
    this.button = button;
  };

  render() {
    const {
      "aria-labelledby": labelledby,
      doNotShowDR,
      mutuallyExclusiveEnabled,
      ...otherProps
    } = this.props;
    return (
      <Menu {...otherProps}>
        <MenuBackground>
          <IconGrid aria-labelledby={labelledby} doNotShowDR={doNotShowDR}>
            {buttons.map((button, index) => {
              const props = {
                ...button,
                onClick: this.handleSelect,
                order: index - buttons.length,
              };
              if (index === 0) {
                props.ref = this.saveButtonRef;
              }
              return (
                <AnswerTypeButton
                  key={button.type}
                  doNotShowDR={doNotShowDR}
                  mutuallyExclusiveEnabled={mutuallyExclusiveEnabled}
                  {...props}
                />
              );
            })}
          </IconGrid>
        </MenuBackground>
      </Menu>
    );
  }
}

export default AnswerTypeGrid;
