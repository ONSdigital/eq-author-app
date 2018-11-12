import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { IconGrid, IconGridButton } from "./index";
import checkboxIcon from "components/AnswerTypeSelector/icons/checkbox.svg";
import currencyIcon from "components/AnswerTypeSelector/icons/currency.svg";
import dateIcon from "components/AnswerTypeSelector/icons/date.svg";
import dateRangeIcon from "components/AnswerTypeSelector/icons/date-range.svg";
import numberIcon from "components/AnswerTypeSelector/icons/number.svg";
import radioIcon from "components/AnswerTypeSelector/icons/radio.svg";
import timeIcon from "components/AnswerTypeSelector/icons/time.svg";
import textareaIcon from "components/AnswerTypeSelector/icons/textarea.svg";
import textfieldIcon from "components/AnswerTypeSelector/icons/textfield.svg";

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
    <IconGridButton iconSrc={timeIcon} title="time" onClick={action("click")} />
    <IconGridButton
      iconSrc={dateRangeIcon}
      title="date range"
      onClick={action("click")}
    />
  </IconGrid>
));
