import React from "react";
import PropTypes from "prop-types";

import { DateInput } from "./components.js";

const CustomEditor = ({ validation, onChange, onUpdate }) => (
  <DateInput
    name="customDate"
    type="date"
    value={validation.customDate}
    onChange={onChange}
    onBlur={onUpdate}
    max="9999-12-30"
    min="1000-01-01"
  />
);

CustomEditor.propTypes = {
  validation: PropTypes.shape({
    customDate: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default CustomEditor;
