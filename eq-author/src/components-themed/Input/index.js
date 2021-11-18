import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { sharedStyles } from "components/Forms/css";
import iconCheckbox from "assets/icon-checkbox.svg";
import withChangeHandler from "components/Forms/withChangeHandler";

const checkBox = css`
  appearance: none;
  &:checked {
    background: url(${iconCheckbox}) no-repeat center;
    background-size: 0.8em auto;
  }
`;

const radioButton = css`
  appearance: none;
  width: 1.25em;
  height: 1.25em;
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
  padding: 0;
  outline: none;
  padding: 0.39rem 0.5rem;
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts};
  line-height: 1rem;
  color: ${({ theme }) => theme.colors.input};
  &:focus {
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.focus};
  }
  ${(props) => props.type === "checkbox" && checkBox};
  ${(props) => props.type === "radio" && radioButton};
`;

export const UncontrolledInput = (props) => {
  const { type, defaultValue, id, forwardRef, ...otherProps } = props;
  return (
    <StyledInput
      ref={forwardRef}
      type={type}
      defaultValue={defaultValue}
      id={id}
      name={id}
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
  ]).isRequired,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  forwardRef: PropTypes.func,
};

export default withChangeHandler(UncontrolledInput);
