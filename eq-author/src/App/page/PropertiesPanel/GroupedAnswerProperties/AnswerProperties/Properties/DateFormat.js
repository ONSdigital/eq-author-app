import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import { DATE } from "constants/answer-types";

import Collapsible from "components/Collapsible";
import { Select } from "components/Forms";

import MultiLineField from "../../MultiLineField";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const DateFormat = ({ answer, value, onChange, getId }) => (
  <Collapsible
    variant="content"
    title={`${answer.type} properties`}
    withoutHideThis
  >
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
    {answer.type === DATE && (
      <MultiLineField
        id={getId("date-format", answer.id)}
        label={"Validation settings"}
      >
        <AnswerValidation answer={answer} />
      </MultiLineField>
    )}
  </Collapsible>
);

DateFormat.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default DateFormat;
