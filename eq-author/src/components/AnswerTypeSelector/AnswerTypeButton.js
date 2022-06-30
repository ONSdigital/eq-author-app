import React from "react";
import PropTypes from "prop-types";
import { IconGridButton } from "components/IconGrid";
import { keys } from "lodash";
import * as AnswerTypes from "constants/answer-types";

import numberIcon from "./icons/number.svg";
import currencyIcon from "./icons/currency.svg";
import unitIcon from "./icons/unit.svg";
import percentageIcon from "./icons/percentage.svg";

import durationIcon from "./icons/duration.svg";
import dateIcon from "./icons/date.svg";
import dateRangeIcon from "./icons/date-range.svg";
import textareaIcon from "./icons/textarea.svg";

import textfieldIcon from "./icons/textfield.svg";
import radioIcon from "./icons/radio.svg";
import checkboxIcon from "./icons/checkbox.svg";
import mutuallyExclusiveIcon from "./icons/or-answer.svg";

export const icons = {
  [AnswerTypes.NUMBER]: numberIcon,
  [AnswerTypes.CURRENCY]: currencyIcon,
  [AnswerTypes.UNIT]: unitIcon,
  [AnswerTypes.PERCENTAGE]: percentageIcon,
  [AnswerTypes.DURATION]: durationIcon,
  [AnswerTypes.DATE]: dateIcon,
  [AnswerTypes.DATE_RANGE]: dateRangeIcon,
  [AnswerTypes.TEXTFIELD]: textfieldIcon,
  [AnswerTypes.TEXTAREA]: textareaIcon,
  [AnswerTypes.RADIO]: radioIcon,
  [AnswerTypes.CHECKBOX]: checkboxIcon,
  [AnswerTypes.MUTUALLY_EXCLUSIVE_OPTION]: mutuallyExclusiveIcon,
};

export default class AnswerTypeButton extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(keys(icons)).isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    order: PropTypes.number,
    doNotShowDR: PropTypes.bool,
    mutuallyExclusiveEnabled: PropTypes.bool,
    radioEnabled: PropTypes.bool,
  };

  handleClick = () => {
    this.props.onClick(this.props.type);
  };

  render() {
    return (
      <IconGridButton
        doNotShowDR={this.props.doNotShowDR}
        mutuallyExclusiveEnabled={this.props.mutuallyExclusiveEnabled}
        radioEnabled={this.props.radioEnabled}
        disabled={this.props.disabled}
        iconSrc={icons[this.props.type]}
        onClick={this.handleClick}
        title={this.props.title}
        titleAriaHidden
        order={this.props.order}
        data-test={`btn-answer-type-${this.props.type.toLowerCase()}`}
      />
    );
  }
}
