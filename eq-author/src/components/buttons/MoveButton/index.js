import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

import IconArrowUp from "./icon-arrow-up.svg?inline";
import IconArrowDown from "./icon-arrow-down.svg?inline";

export const IconUp = IconArrowUp;
export const IconDown = IconArrowDown;

const Button = styled.button`
  display: block;
  color: ${(props) =>
    props.color === "white" ? colors.white : colors.secondary};
  border: none;
  padding: 0;
  padding-top: 0.3em;
  width: 2em;
  height: 2em;
  font-size: 1em;
  cursor: pointer;
  transition: color 200ms ease-in, opacity 300ms ease-in;
  background: transparent;

  svg {
    pointer-events: none;
  }

  path {
    fill: currentColor;
  }

  &:hover {
    background: ${colors.highlightBlue};
    color: ${colors.white};
  }

  &:focus {
    outline: 3px solid ${colors.orange};
  }

  &[aria-disabled="true"] {
    svg {
      opacity: 0.3;
    }
    pointer-events: none;
  }
`;

const MoveButton = ({ disabled, onClick, children, ...otherProps }) => {
  let props;
  if (disabled) {
    props = {
      ...otherProps,
      "aria-disabled": true,
    };
  } else {
    props = {
      ...otherProps,
      onClick,
    };
  }

  return <Button {...props}>{children}</Button>;
};

MoveButton.propTypes = {
  color: PropTypes.oneOf(["white", "secondary"]),
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

MoveButton.defaultProps = {
  disabled: false,
  color: "secondary",
};

export default MoveButton;
