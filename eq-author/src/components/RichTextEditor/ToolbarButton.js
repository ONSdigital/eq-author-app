import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { colors } from "constants/theme";
import Tooltip from "components/Forms/Tooltip";
import VisuallyHidden from "components/VisuallyHidden";

const activeState = css`
  color: ${colors.black};
  background-color: rgba(0, 0, 0, 0.2);
`;

const StyledToolbarButton = styled.button.attrs({ type: "button" })`
  display: block;
  padding: 0;
  border: none;
  font-size: 1rem;
  margin: 0;
  background: transparent;
  color: ${colors.darkGrey};
  transition: background-color 100ms ease-in;
  cursor: pointer;

  svg {
    vertical-align: middle;
    pointer-events: none;
    path {
      fill: currentColor;
    }
  }

  &:focus {
    outline: 2px solid ${colors.orange};
    outline-offset: -2px;
  }

  &:hover {
    color: ${colors.black};
    background-color: rgba(0, 0, 0, 0.1);
    outline: none;
  }

  &[disabled] {
    opacity: 0.2;
    pointer-events: none;
  }

  ${(props) => props.active && activeState};
`;

const ToolbarButton = ({
  title,
  children,
  active,
  canFocus,
  disabled,
  modalVisible,
  ...otherProps
}) => {
  return !modalVisible ? (
    <Tooltip content={title} place="top" offset={{ bottom: 8 }} key={title}>
      <StyledToolbarButton
        active={active && canFocus}
        disabled={disabled || !canFocus}
        {...otherProps}
      >
        {children}
        <VisuallyHidden>{title}</VisuallyHidden>
      </StyledToolbarButton>
    </Tooltip>
  ) : (
    <StyledToolbarButton
      active={active && canFocus}
      disabled={disabled || !canFocus}
      {...otherProps}
    >
      {children}
      <VisuallyHidden>{title}</VisuallyHidden>
    </StyledToolbarButton>
  );
};

ToolbarButton.propTypes = {
  active: PropTypes.bool,
  canFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  modalVisible: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ToolbarButton;
