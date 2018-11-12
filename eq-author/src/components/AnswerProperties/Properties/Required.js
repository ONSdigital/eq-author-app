import React from "react";
import PropTypes from "prop-types";

import ToggleSwitch from "components/ToggleSwitch";

const Required = ({ id, value, onChange }) => (
  <ToggleSwitch id={id} name={id} onChange={onChange} checked={value} />
);

Required.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

export default Required;
