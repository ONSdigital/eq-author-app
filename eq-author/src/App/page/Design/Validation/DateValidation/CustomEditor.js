import React from "react";
import PropTypes from "prop-types";

import { ERR_NO_VALUE } from "constants/validationMessages";

import ValidationError from "components/ValidationError";
import { DateInput } from "./components.js";

const CustomEditor = ({ validation, onChange, onUpdate }) => (
  <>
    <DateInput
      name="customDate"
      type="date"
      value={validation.customDate}
      onChange={onChange}
      onBlur={onUpdate}
      max="9999-12-30"
      min="1000-01-01"
    />
    {validation.validationErrorInfo.errors.some(
      (error) => error.errorCode === "ERR_NO_VALUE"
    ) && <ValidationError>{ERR_NO_VALUE}</ValidationError>}
  </>
);

CustomEditor.propTypes = {
  validation: PropTypes.shape({
    customDate: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CustomEditor;
