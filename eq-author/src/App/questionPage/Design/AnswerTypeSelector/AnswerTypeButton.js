import React from "react";
import PropTypes from "prop-types";
import { IconGridButton } from "components/IconGrid";
import { keys } from "lodash";
import * as AnswerTypes from "constants/answer-types";

import checkboxIcon from "App/questionPage/Design/AnswerTypeSelector/icons/checkbox.svg";
import currencyIcon from "App/questionPage/Design/AnswerTypeSelector/icons/currency.svg";
import dateIcon from "App/questionPage/Design/AnswerTypeSelector/icons/date.svg";
import dateRangeIcon from "App/questionPage/Design/AnswerTypeSelector/icons/date-range.svg";
import numberIcon from "App/questionPage/Design/AnswerTypeSelector/icons/number.svg";
import radioIcon from "App/questionPage/Design/AnswerTypeSelector/icons/radio.svg";
import timeIcon from "App/questionPage/Design/AnswerTypeSelector/icons/time.svg";
import textareaIcon from "App/questionPage/Design/AnswerTypeSelector/icons/textarea.svg";
import textfieldIcon from "App/questionPage/Design/AnswerTypeSelector/icons/textfield.svg";

export const icons = {
  [AnswerTypes.CHECKBOX]: checkboxIcon,
  [AnswerTypes.CURRENCY]: currencyIcon,
  [AnswerTypes.DATE]: dateIcon,
  [AnswerTypes.DATE_RANGE]: dateRangeIcon,
  [AnswerTypes.NUMBER]: numberIcon,
  [AnswerTypes.RADIO]: radioIcon,
  [AnswerTypes.TIME]: timeIcon,
  [AnswerTypes.TEXTAREA]: textareaIcon,
  [AnswerTypes.TEXTFIELD]: textfieldIcon
};
export default class AnswerTypeButton extends React.Component {
  static propTypes = {
    type: PropTypes.oneOf(keys(icons)).isRequired,
    title: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    order: PropTypes.number
  };

  handleClick = () => {
    this.props.onClick(this.props.type);
  };

  render() {
    const { disabled, title, type, order } = this.props;

    return (
      <IconGridButton
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
