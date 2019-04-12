import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";

const Button = styled.button`
  display: block;
  color: ${colors.secondary};
  border: none;
  padding: 0;
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
    color: ${colors.black};
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
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

MoveButton.defaultProps = {
  disabled: false,
};

export default MoveButton;
