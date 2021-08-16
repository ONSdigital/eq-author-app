import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import Collapsible from "components/Collapsible";
import { Select } from "components/Forms";

import MultiLineField from "../../MultiLineField";
import InlineField from "../../InlineField";
import { ToggleProperty } from ".";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const DateFormat = ({
  answer,
  value,
  onChange,
  handleRequiredChange,
  getId,
}) => {
  const id = getId("date", answer.id);

  return (
    <Collapsible
      variant="content"
      title={`${answer.type} properties`}
      withoutHideThis
    >
      <InlineField id={id} label={"Required"}>
        <ToggleProperty
          data-test="answer-properties-required-toggle"
          id={id}
          onChange={handleRequiredChange}
          value={answer.properties.required}
        />
      </InlineField>
      <MultiLineField id={getId("date-format", answer.id)} label={"Date type"}>
        <Select
          data-test="select"
          value={value}
          onChange={onChange}
          id={getId("date-format", answer.id)}
          name={getId("date-format", answer.id)}
        >
          <option
            data-test="day-month-year"
            value="dd/mm/yyyy"
          >{`dd / ${monthText} / yyyy`}</option>
          <option
            data-test="month-year"
            value="mm/yyyy"
          >{`${monthText} / yyyy`}</option>
          <option data-test="year" value="yyyy">
            yyyy
          </option>
        </Select>
      </MultiLineField>
      <MultiLineField
        id={getId("date-format", answer.id)}
        label={"Validation settings"}
      >
        <AnswerValidation answer={answer} />
      </MultiLineField>
    </Collapsible>
  );
};

DateFormat.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleRequiredChange: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default DateFormat;
