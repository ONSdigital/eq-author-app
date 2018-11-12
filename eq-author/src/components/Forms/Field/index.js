import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledField = styled.div`
  display: block;
  width: 100%;
  margin-bottom: ${props => (props.last ? "0" : "1")}em;
  position: relative;
`;

const Field = ({ children, last, ...otherProps }) => (
  <StyledField last={last} {...otherProps}>
    {children}
  </StyledField>
);

Field.propTypes = {
  children: PropTypes.node.isRequired,
  last: PropTypes.bool
};

Field.defaultProps = {
  last: false
};

export default Field;
