import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledForm = styled.form`
  width: 100%;
  margin-bottom: 0;
`;

const Form = ({ action, children, onSubmit, ...otherProps }) => (
  <StyledForm
    action={action}
    method="POST"
    onSubmit={onSubmit}
    autoComplete="off"
    {...otherProps}
  >
    {children}
  </StyledForm>
);

Form.propTypes = {
  action: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default Form;
