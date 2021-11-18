import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { sharedStyles } from "components/Forms/css";
import iconCheckbox from "assets/icon-checkbox.svg";
import withChangeHandler from "components/Forms/withChangeHandler";

const checkBox = css`
  &:checked {
    background: url(${iconCheckbox}) no-repeat center;
    background-size: 0.8em auto;
  }
`;

const radioButton = css`
  border-radius: 100%;
  width: 1.25em;
  height: 1.25em;
  position: absolute;
  border-radius: 100%;
  background: ${({ theme }) => theme.colors.grey15};
  border: 2px solid ${({ theme }) => theme.colors.white};
  outline: none;
  &:checked {
    background: ${({ theme }) => theme.colors.input};
  }
  :checked:before {
    background: ${({ theme }) => theme.colors.input};
  }
  :hover {
    border-radius: 100%;
    outline: none;
    border: 2px solid ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.input};
  }
  :focus {
    border-radius: 100%;
    outline: none;
    border: 2px solid ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.input};
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
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.focus};
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
