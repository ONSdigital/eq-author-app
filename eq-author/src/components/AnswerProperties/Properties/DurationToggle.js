import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

import { sharedStyles, focusStyle } from "../../Forms/css";
import iconAdd from "./icon-add.svg";
import iconClose from "./icon-close.svg";

const Toggle = styled.div`
  position: relative;
  border-radius: 4px;
  &:focus-within {
    ${focusStyle};
    outline: none;
  }

  :focus:not(:focus-visible) {
    outline: none;
  }
`;

const Label = styled.label`
  ${sharedStyles};
  border-radius: 4px;
  color: ${colors.lightGrey};
  border-color: ${colors.lightGrey};

  &:focus,
  &:hover {
    outline: none;
  }
`;

const Input = styled.input`
  position: absolute;
  right: 0.5em;
  top: 0;
  bottom: 0;
  left: auto;
  width: 2em;
  height: 2em;
  margin: auto;
  appearance: none;
  background: url(${iconAdd}) 50% no-repeat;

  &:checked + ${Label} {
    border-color: ${colors.grey};
    color: ${colors.text};
  }
  &:checked {
    background-image: url(${iconClose});
  }
  &:focus {
    outline: none;
  }
`;

const DurationToggle = ({ id, children, ...otherProps }) => {
  return (
    <Toggle>
      <Input type="checkbox" id={id} name={id} />
      <Label htmlFor={id}>{children}</Label>
    </Toggle>
  );
};

export default DurationToggle;
