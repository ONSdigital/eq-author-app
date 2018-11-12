import React from "react";
import PropTypes from "prop-types";

const PanelBody = ({ id, open, labelledBy, children, ...otherProps }) => (
  <div
    id={id}
    role="tabpanel"
    aria-hidden={!open}
    aria-labelledby={labelledBy}
    {...otherProps}
  >
    {children}
  </div>
);

PanelBody.propTypes = {
  id: PropTypes.string.isRequired,
  labelledBy: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

export default PanelBody;
