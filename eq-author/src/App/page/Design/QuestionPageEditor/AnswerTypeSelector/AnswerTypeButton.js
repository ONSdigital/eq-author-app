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
};

export default class AnswerTypeButton extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(keys(icons)).isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    order: PropTypes.number,
  };

  handleClick = () => {
    this.props.onClick(this.props.type);
  };

  render() {
    const { disabled, title, type, order, doNotShowDR } = this.props;

    return (
      <IconGridButton
        doNotShowDR={doNotShowDR}
        disabled={disabled}
        iconSrc={icons[type]}
        onClick={this.handleClick}
        title={title}
        order={order}
        data-test={`btn-answer-type-${type.toLowerCase()}`}
      />
    );
  }
}
