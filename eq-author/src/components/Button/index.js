import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { propTypes } from "./propTypes";

import { radius, colors } from "constants/theme";

export const primaryButton = css`
  --color-text: ${colors.white};
  --color-bg: ${colors.primary};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${colors.secondary};
    border-color: var(--color-bg);
  }
`;

export const secondaryButton = css`
  --color-text: ${colors.primary};
  --color-bg: ${colors.white};
  border: 1px solid var(--color-text);

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${colors.secondary};
    border-color: var(--color-bg);
  }
`;

export const tertiaryButton = css`
  --color-text: ${colors.primary};
  --color-bg: transparent;
  border: 1px solid transparent;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${colors.primary};
  }
`;

export const tertiaryLightButton = css`
  ${tertiaryButton};

  --color-text: ${colors.white};

  &:hover {
    --color-text: ${colors.black};
    --color-bg: ${colors.white};
  }
`;

export const smallButton = css`
  padding: 0;
`;

const Button = styled.button`
  display: inline-flex;
  flex: 0 0 auto;
  color: var(--color-text);
  background-color: var(--color-bg);
  padding: 0.75em 2em;
  border-radius: ${radius};
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  text-decoration: none;
  transition: all 100ms ease-out;
  letter-spacing: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-bg);

  &:focus,
  &:active {
    outline-width: 0;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }

  ${props => props.variant === "primary" && primaryButton};
  ${props => props.variant === "secondary" && secondaryButton};
  ${props => props.variant === "tertiary" && tertiaryButton};
  ${props => props.variant === "tertiary-light" && tertiaryLightButton};
  ${props => props.small && smallButton};
`;

Button.propTypes = {
  ...propTypes,
  type: PropTypes.oneOf(["button", "submit"])
};

Button.defaultProps = {
  type: "button",
  variant: "primary"
};

export default Button;
