import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledField = styled.div`
  display: block;
  margin-bottom: ${(props) => (props.last ? "0" : "1")}em;
  position: relative;
  ${(props) => props.disabled && "opacity: 0.6;"}
`;

const Field = ({ children, last, ...otherProps }) => (
  <StyledField last={last} {...otherProps}>
    {children}
  </StyledField>
);

Field.propTypes = {
  children: PropTypes.node.isRequired,
  last: PropTypes.bool,
  disabled: PropTypes.bool,
};

Field.defaultProps = {
  last: false,
  disabled: false,
};

export default Field;
