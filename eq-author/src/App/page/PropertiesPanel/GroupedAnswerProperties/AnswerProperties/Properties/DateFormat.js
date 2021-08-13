import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import Collapsible from "components/Collapsible";
import { Select } from "components/Forms";

import MultiLineField from "../../MultiLineField";

import AnswerValidation from "App/page/Design/Validation/AnswerValidation";

const monthText = enableOn(["hub"]) ? "mm" : "Month";

const DateFormat = ({ answer, id, value, onChange, getId }) => (
  <Collapsible variant="content" title="Date properties" withoutHideThis>
    <MultiLineField id={getId("date-format", id)} label={"Date type"}>
      <Select
        data-test="select"
        value={value}
        onChange={onChange}
        id={id}
        name={id}
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
    <MultiLineField id={getId("date-format", id)} label={"Validation settings"}>
      <AnswerValidation answer={answer} />
    </MultiLineField>
  </Collapsible>
);

DateFormat.propTypes = {
  answer: PropTypes.object, //eslint-disable-line
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  getId: PropTypes.func,
};

export default DateFormat;
