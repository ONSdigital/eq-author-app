import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { sharedStyles } from "components/Forms/css";
import iconCheckbox from "./icon-checkbox.svg";
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
    border-radius: 100%;
    outline: none;
    position: absolute;
    overflow: hidden;
    padding: 0;
    display: flex;
    border: 1px solid ${colors.black};

    :before {
      content: "";
      display: block;
      width: 80%;
      height: 80%;
      margin: 10% auto;
      border-radius: 100%;
      background: ${colors.lighterGrey};
    }
    :checked:before {
      background: ${colors.black};
    }
    `}

  &:checked {
    background: url(${iconCheckbox}) no-repeat center;
    background-size: 0.8em auto;
  }
`;

const StyledInput = styled.input`
  ${sharedStyles};
  ${props => props.type === "checkbox" && checkBox};
  ${props => props.type === "radio" && radioButton};
`;

export const UncontrolledInput = ({
  type,
  defaultValue,
  id,
  ...otherProps
}) => (
  <StyledInput
    type={type}
    defaultValue={defaultValue}
    id={id}
    name={id}
    {...otherProps}
  />
);

UncontrolledInput.defaultProps = {
  type: "text",
};

UncontrolledInput.propTypes = {
  id: PropTypes.string,
  type: PropTypes.oneOf([
    "text",
    "checkbox",
    "radio",
    "radioNoCheckbox",
    "number",
    "date",
    "search",
  ]).isRequired,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
};

export default withChangeHandler(UncontrolledInput);
