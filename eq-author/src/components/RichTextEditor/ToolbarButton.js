import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { colors } from "constants/theme";
import Tooltip from "../Tooltip";
import VisuallyHidden from "../VisuallyHidden";

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

  ${props => props.active && activeState};
`;

const ToolbarButton = ({ title, children, active, ...otherProps }) => (
  <Tooltip content={title} place="top" offset={{ bottom: 8 }} key={title}>
    <StyledToolbarButton active={active} {...otherProps}>
      {children}
      <VisuallyHidden>{title}</VisuallyHidden>
    </StyledToolbarButton>
  </Tooltip>
);

ToolbarButton.propTypes = {
  active: PropTypes.bool,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default ToolbarButton;
