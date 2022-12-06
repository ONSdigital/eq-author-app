import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { sharedStyles } from "components/Forms/css";
import iconCheckbox from "assets/icon-checkbox.svg";
import withChangeHandler from "components/Forms/withChangeHandler";

import { colors } from "constants/theme";

const multipleChoiceOption = css`
  display: inline-block;
  width: 1.1em;
  height: 1.1em;
  padding: 0;
  margin: 0 1em 0 0;
  vertical-align: middle;
  appearance: none;
  font-size: 1em;
`;

const checkBox = css`
  ${multipleChoiceOption};

  &:checked {
    background: url(${iconCheckbox}) no-repeat center;
    background-size: 0.8em auto;
  }
`;

const radioButton = css`
  ${multipleChoiceOption};
  border-radius: 100%;

  ${({ variant }) =>
    variant === "radioBox" &&
    `
      width: 1.25em;
      height: 1.25em;
      position: absolute;
      border-radius: 100%;
      background: ${colors.lightGrey}
      border: 2px solid ${colors.white};
      box-shadow: 0 0 0 1px ${colors.black};
      outline: none;
      &:checked {
        background: ${colors.black} !important;
      }
      :checked:before {
        background: ${colors.black};
      }
      :hover {
        border-radius: 100%;
        outline: none;
        border: 2px solid ${colors.white};
        box-shadow: 0 0 0 1px ${colors.black};
      }
      :focus {
        border-radius: 100%;
        outline: none;
        border: 2px solid ${colors.white};
        box-shadow: 0 0 0 1px ${colors.black};
      }
    `}

  &:checked {
    background: url(${iconCheckbox}) no-repeat center;
    background-size: 0.8em auto;
  }
`;

const StyledInput = styled.input`
  ${sharedStyles};
  ${(props) => props.type === "checkbox" && checkBox};
  ${(props) => props.type === "radio" && radioButton};
  border-radius: 0.15em;
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
