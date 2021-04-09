import React from "react";
import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { colors } from "constants/theme";

import { ReactComponent as Icon } from "./icon-close.svg";

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
  color: ${colors.secondary};
  border: none;
  background: transparent;
  cursor: pointer;
  transition: color 200ms ease-in, opacity 300ms ease-in;
  width: 1em;
  height: 1em;
  padding: 0;

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

  ${(props) => sizes[props.size]};
`;

const CloseIcon = styled(Icon)`
  pointer-events: none;
  display: block;
  width: 1em;
  height: 1em;

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
  size: "medium",
  type: "button",
  "aria-label": "Delete",
};

DeleteButton.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default DeleteButton;
