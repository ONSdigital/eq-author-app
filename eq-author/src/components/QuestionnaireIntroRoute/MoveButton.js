import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

const Button = styled.button`
  display: block;
  color: ${colors.secondary};
  border: none;
  padding: 0;
  display: block;
  width: 2em;
  height: 2em;
  font-size: 1em;
  cursor: pointer;
  transition: color 200ms ease-in, opacity 300ms ease-in;

  svg {
    pointer-events: none;
  }

  path {
    fill: currentColor;
  }

  &:hover {
    color: ${colors.black};
  }

  &:focus {
    outline: 3px solid ${colors.orange};
  }

  &[disabled] {
    opacity: 0.3;
    pointer-events: none;
  }
`;

const MoveButton = ({ icon: Icon, ...otherProps }) => (
  <Button {...otherProps}>
    <Icon />
  </Button>
);

export default MoveButton;
