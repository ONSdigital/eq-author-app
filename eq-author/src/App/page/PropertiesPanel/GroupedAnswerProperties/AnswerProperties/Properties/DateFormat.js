import React from "react";
import PropTypes from "prop-types";
import { enableOn } from "utils/featureFlags";

import { Field, Select } from "components/Forms";

const DateFormat = ({ id, value, onChange }) => (
  <Field>
      {enableOn(["hub"]) ? 

        <Select data-test="select" value={value} onChange={onChange} id={id} name={id}>
            <option data-test="day-month-year" value="dd/mm/yyyy">dd / mm / yyyy</option>
            <option data-test="month-year" value="mm/yyyy">mm / yyyy</option>
            <option data-test="year" value="yyyy">yyyy</option> 
        </Select>

      : 
        <Select data-test="select" value={value} onChange={onChange} id={id} name={id}>
          <option data-test="day-month-year" value="dd/mm/yyyy">dd / Month / yyyy</option>
          <option data-test="month-year" value="mm/yyyy">Month / yyyy</option>
          <option data-test="year" value="yyyy">yyyy</option>
        </Select>
      }

  </Field>
);

DateFormat.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateFormat;
