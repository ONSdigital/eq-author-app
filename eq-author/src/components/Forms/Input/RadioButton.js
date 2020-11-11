import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { sharedStyles } from "components/Forms/css";
import withChangeHandler from "components/Forms/withChangeHandler";

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

const radioButton = css`
  ${multipleChoiceOption};
  width: 20px;
  height: 20px;
  border-radius: 100%;
  outline: none;
  :hover {
  }
  :before {
    content: "";
    display: block;
    width: 60%;
    height: 60%;
    margin: 15% auto;
    border-radius: 100%;
    background: #dcdcdc;
  }
  :checked:before {
    background: #323232;
  }
`;

const StyledInput = styled.input`
  ${sharedStyles};
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
