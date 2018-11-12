import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Menu = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  margin: auto;
  padding: 0.5em;
`;

const IconGrid = ({
  children,
  "aria-labelledby": labelledby,
  ...otherProps
}) => (
  <Menu role="menu" aria-labelledby={labelledby} {...otherProps}>
    {children}
  </Menu>
);

IconGrid.propTypes = {
  children: PropTypes.node.isRequired,
  "aria-labelledby": PropTypes.string
};

export default IconGrid;
