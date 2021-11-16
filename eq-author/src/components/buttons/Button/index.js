import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { darken } from "polished";

import { propTypes } from "./propTypes";

import { radius, colors, focusStyle } from "constants/theme";

export const primaryButton = css`
  --color-text: ${colors.white};
  --color-bg: ${colors.primary};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${darken(0.1, colors.secondary)};
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

export const positiveButton = css`
  --color-text: ${colors.white};
  --color-bg: ${colors.positive};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${darken(0.1, colors.positive)};
    border-color: var(--color-bg);
  }
`;

export const negativeButton = css`
  --color-text: ${colors.white};
  --color-bg: ${colors.negative};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${darken(0.1, colors.negative)};
    border-color: var(--color-bg);
  }
`;

export const navigationButton = css`
  --color-text: ${colors.grey};
  --color-bg: ${colors.black};

  position: relative;
  border-bottom: 1px solid ${colors.black};
  border-radius: 0;

  &:hover {
    --color-text: ${colors.lighterGrey};
    --color-bg: ${darken(0.1, colors.textLight)};
    border-color: var(--color-bg);
    border-bottom: 1px solid ${colors.white};
    border-radius: 0;
  }

  &:focus {
    background-color: ${colors.tertiary};
    box-shadow: 0;
    outline: 0;

    --color-text: ${colors.black};
  }
`;

export const navigationModalButton = css`
  --color-text: ${colors.grey};
  --color-bg: ${colors.black};

  position: relative;
  border-bottom: 1px solid ${colors.black};
  border-radius: 0;

  &:hover {
    --color-text: ${colors.lighterGrey};
    --color-bg: ${darken(0.1, colors.textLight)};
    border-color: var(--color-bg);
    border-bottom: 1px solid ${colors.white};
    border-radius: 0;
  }
`;
export const navigationOnButton = css`
  --color-text: ${colors.black};
  --color-bg: ${colors.tertiary};

  position: relative;
  border-bottom: 1px solid ${colors.black};
  border-radius: 0;
`;

export const signoutButton = css`
  color: ${colors.black};

  --color-text: ${colors.black};
  --color-bg: ${colors.black};

  position: relative;
  border-radius: 0;

  &:hover {
    background-color: ${darken(0.1, colors.orange)};

    --color-text: ${darken(0.1, colors.black)};
    --color-bg: ${darken(0.1, colors.orange)};
    border-color: var(--color-bg);
    border-radius: 0;
  }

  &:focus {
    background-color: ${colors.tertiary};
    box-shadow: 0;
    outline: 0;

    --color-text: ${colors.black};
  }
`;

export const greyedButton = css`
  --color-text: ${colors.white};
  --color-bg: ${colors.grey};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${darken(0.1, colors.grey)};
    border-color: var(--color-bg);
  }
`;

export const navHeaderButton = css`
  --color-text: ${colors.white};
  --color-bg: ${colors.darkGrey};

  border: none;
  border-radius: 0;

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${colors.black};
    border-radius: 0;
  }

  &:active {
    background-color: ${colors.darkGrey};
    box-shadow: 0;
    outline: 0;

    --color-text: ${colors.white};
  }
`;

export const navAddMenuButton = css`
  --color-text: ${colors.black};
  --color-bg: ${colors.tertiary};

  border: none;
  border-radius: 0;

  justify-content: left;
  font-size: 0.9em;
  padding: 0.2em 1.6em;
  white-space: nowrap;

  &:hover {
    --color-bg: ${colors.greyedOrange};
    border-radius: 0;
  }

  &:focus {
    background-color: ${colors.darkGrey};
    box-shadow: 0;
    outline: 0;

    --color-text: ${colors.white};
  }

  &[disabled] {
    --color-text: ${colors.disabledGreyOnOrange};
    opacity: 1;

    span {
      svg {
        path {
          fill: ${colors.disabledGreyOnOrange};
        }
      }
    }
  }
`;

export const mediumButton = css`
  padding: 0.4em 0.8em;
`;

export const smallButton = css`
  padding: 0;
`;

export const smallMediumButton = css`
  padding: 0.4em 0.6em;
  font-size: 0.9em;
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

  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }

  &:focus-within {
    ${focusStyle}
  }

  ${(props) => props.variant === "primary" && primaryButton};
  ${(props) => props.variant === "secondary" && secondaryButton};
  ${(props) => props.variant === "tertiary" && tertiaryButton};
  ${(props) => props.variant === "tertiary-light" && tertiaryLightButton};
  ${(props) => props.variant === "positive" && positiveButton};
  ${(props) => props.variant === "negative" && negativeButton};
  ${(props) => props.variant === "navigation" && navigationButton};
  ${(props) => props.variant === "navigation-modal" && navigationModalButton};
  ${(props) => props.variant === "navigation-on" && navigationOnButton};
  ${(props) => props.variant === "signout" && signoutButton};
  ${(props) => props.variant === "greyed" && greyedButton};
  ${(props) => props.variant === "nav-header" && navHeaderButton};
  ${(props) => props.variant === "add-content-menu" && navAddMenuButton};
  ${(props) => props.medium && mediumButton};
  ${(props) => props.small && smallButton};
  ${(props) => props["small-medium"] && smallMediumButton};
`;

Button.propTypes = {
  ...propTypes,
  type: PropTypes.oneOf(["button", "submit"]),
};

Button.defaultProps = {
  type: "button",
  variant: "primary",
};

export default Button;
