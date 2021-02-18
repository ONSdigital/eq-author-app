import React from "react";
import PropTypes from "prop-types";
import { RelativePositionSelect } from "./components";

const RELATIVE_POSITIONS = ["Before", "After"];

const PositionPicker = ({ value, onChange, onUpdate }) => (
  <RelativePositionSelect
    name="relativePosition"
    value={value}
    onChange={onChange}
    onBlur={onUpdate}
    data-test="relative-position-select"
  >
    {RELATIVE_POSITIONS.map((position) => (
      <option key={position} value={position}>
        {position.toLowerCase()}
      </option>
    ))}
  </RelativePositionSelect>
);

PositionPicker.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default PositionPicker;
