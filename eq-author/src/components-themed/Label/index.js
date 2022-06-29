import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const StyledLabel = styled.label`
  display: ${(props) => (props.inline ? "inline-block" : "block")};
  margin-bottom: ${(props) =>
    props.inline || props.hasDescription ? "0" : "0.4em"};
  font-weight: ${(props) => (props.bold ? "bold" : "normal")};
  vertical-align: middle;
  color: ${colors.text};
  line-height: 1.6;
  font-size: 1.125rem;
`;

const Label = ({ htmlFor, children, ...otherProps }) => (
  <StyledLabel htmlFor={htmlFor} {...otherProps}>
    {children}
  </StyledLabel>
);

Label.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node.isRequired,
  bold: PropTypes.bool,
  hasDescription: PropTypes.bool,
};

Label.defaultProps = {
  bold: true,
  hasDescription: false,
};

export default Label;

export const OptionLabel = styled.label`
  margin: 0 0 1.5rem 0.5rem;
  align-items: flex-start;
  font-size: 1.125rem;
`;
