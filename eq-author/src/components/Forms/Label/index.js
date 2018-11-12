import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const StyledLabel = styled.label`
  display: ${props => (props.inline ? "inline-block" : "block")};
  margin-bottom: ${props => (props.inline ? "0" : "0.4em")};
  font-weight: ${props => (props.bold ? "bold" : "normal")};
  vertical-align: middle;
  color: ${colors.darkGrey};
  line-height: 1.3;
`;

const Label = ({ htmlFor, children, ...otherProps }) => (
  <StyledLabel htmlFor={htmlFor} {...otherProps}>
    {children}
  </StyledLabel>
);

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  bold: PropTypes.bool
};

Label.defaultProps = {
  bold: true
};

export default Label;
