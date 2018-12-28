import React from "react";
import PropTypes from "prop-types";

const DurationPreview = ({ duration: { unit, value } }) => {
  if (value === 0) {
    return;
  }
  return (
    <React.Fragment>
      <div>{`${value} ${unit.toLowerCase()}`}</div>
    </React.Fragment>
  );
};

DurationPreview.propTypes = {
  duration: PropTypes.shape({
    value: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired
  }).isRequired
};

export default DurationPreview;
