import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import iconCheckbox from "assets/icon-checkbox-ons.svg";
import withChangeHandler from "components/Forms/withChangeHandler";

const checkBox = css`
  appearance: none;
  width: 22px;
  height: 22px;
  border: 2px solid ${({ theme }) => theme.colors.input};
  border-radius: 0.2rem;
  &:checked {
    background: url(${iconCheckbox}) no-repeat center;
    top: 14px;
    left: 11px;
    background-size: 14px;
  }
`;

const hasError = css`
  border: 1px solid ${({ theme }) => theme.colors.red};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.red};
`;

const radioButton = css`
  appearance: none;
  width: 1.2em;
  height: 1.2em;
  position: absolute;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.grey15};
  border: 1px solid ${({ theme }) => theme.colors.input};
  outline: none;
  box-shadow: inset 0 0 0 3px ${({ theme }) => theme.colors.white};
  &:checked {
    background: ${({ theme }) => theme.colors.input};
    box-shadow: inset 0 0 0 3px ${({ theme }) => theme.colors.white};
  }
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus},
      inset 0 0 0 3px ${({ theme }) => theme.colors.white};
  }
`;

const StyledInput = styled.input`
  border-radius: ${({ theme }) => theme.radius};
  border: 1px solid ${({ theme }) => theme.colors.input};
  outline: none;
  padding: 0.39rem 0.5rem;
  font-size: 1rem;
  line-height: 1rem;
  color: ${({ theme }) => theme.colors.input};
  min-width: 375px;
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
  ${(props) => props.type === "checkbox" && checkBox};
  ${(props) => props.type === "radio" && radioButton};
  ${(props) => props.hasError && hasError};
`;

export const UncontrolledInput = (props) => {
  const { type, defaultValue, id, forwardRef, hasError, ...otherProps } = props;
  return (
    <StyledInput
      ref={forwardRef}
      type={type}
      defaultValue={defaultValue}
      id={id}
      name={id}
      hasError={hasError}
      {...otherProps}
    />
  );
};

UncontrolledInput.defaultProps = {
  type: "text",
};

UncontrolledInput.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "checkbox",
    "radio",
    "number",
    "date",
    "search",
    "password",
  ]).isRequired,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  forwardRef: PropTypes.func,
  hasError: PropTypes.bool,
};

export default withChangeHandler(UncontrolledInput);
