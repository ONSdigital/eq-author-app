import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledForm = styled.form`
  width: ${({ htmlWidth }) => (htmlWidth ? htmlWidth : "100%")};
  margin-bottom: 0;
`;

const Form = ({ action, children, onSubmit, htmlWidth, ...otherProps }) => (
  <StyledForm
    action={action}
    method="POST"
    onSubmit={onSubmit}
    autoComplete="off"
    htmlWidth={htmlWidth}
    {...otherProps}
  >
    {children}
  </StyledForm>
);

Form.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  htmlWidth: PropTypes.string,
};

export default Form;
