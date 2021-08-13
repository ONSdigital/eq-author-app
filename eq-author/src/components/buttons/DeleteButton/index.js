import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

import { ReactComponent as Icon } from "./icon-delete.svg";

const sizes = {
  small: css`
    font-size: 1.5em;
  `,

  medium: css`
    font-size: 2em;
  `,

  large: css`
    font-size: 3em;
  `,
};

const StyledDeleteButton = styled.button`
  color: ${(props) =>
    props.color === "white" ? colors.white : colors.secondary};
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 200ms ease-in, opacity 300ms ease-in;
  width: 1em;
  height: 1em;
  padding: 0;

  &:hover {
    background: ${colors.highlightBlue};
    color: ${colors.white};
  }

  &:focus {
    outline: 3px solid ${colors.orange};
  }

  &[disabled] {
    opacity: 0.3;
    pointer-events: none;
  }

  ${(props) => sizes[props.size]};
`;

const CloseIcon = styled(Icon)`
  pointer-events: none;
  display: block;
  width: 1em;
  height: 0.7em;

  path {
    fill: currentColor;
  }
`;

const DeleteButton = (props) => (
  <StyledDeleteButton role="button" {...props}>
    <CloseIcon />
  </StyledDeleteButton>
);

DeleteButton.defaultProps = {
  color: "secondary",
  size: "medium",
  type: "button",
  "aria-label": "Delete",
};

DeleteButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["white", "secondary"]),
  type: PropTypes.string,
};

export default DeleteButton;
