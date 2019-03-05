import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { IconGrid, IconGridButton } from ".";
import checkboxIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/checkbox.svg";
import currencyIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/currency.svg";
import dateIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/date.svg";
import dateRangeIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/date-range.svg";
import numberIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/number.svg";
import radioIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/radio.svg";
import textareaIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/textarea.svg";
import textfieldIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/textfield.svg";
import percentageIcon from "App/questionPage/Design/QuestionPageEditor/AnswerTypeSelector/icons/percentage.svg";

storiesOf("IconGrid", module).add("Default", () => (
  <IconGrid>
    <IconGridButton
      iconSrc={checkboxIcon}
      title="checkbox"
      onClick={action("click")}
    />
    <IconGridButton
      iconSrc={currencyIcon}
      title="currency"
      onClick={action("click")}
    />
    <IconGridButton iconSrc={dateIcon} title="date" onClick={action("click")} />
    <IconGridButton
      iconSrc={numberIcon}
      title="number"
      onClick={action("click")}
    />
    <IconGridButton
      iconSrc={radioIcon}
      title="radio"
      onClick={action("click")}
    />
    <IconGridButton
      iconSrc={textareaIcon}
      title="textarea"
      onClick={action("click")}
    />
    <IconGridButton
      iconSrc={textfieldIcon}
      title="textfield"
      onClick={action("click")}
    />
    <IconGridButton
      iconSrc={dateRangeIcon}
      title="date range"
      onClick={action("click")}
    />
    <IconGridButton
      iconSrc={percentageIcon}
      title="percentage"
      onClick={action("click")}
    />
  </IconGrid>
));
