import React from "react";
import PropTypes from "prop-types";

import ToggleSwitch from "components/buttons/ToggleSwitch";

const ToggleProperty = ({ id, value, onChange }) => (
  <ToggleSwitch id={id} name={id} onChange={onChange} checked={value} />
);

ToggleProperty.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ToggleProperty;
