import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { darken } from "polished";

import { propTypes } from "./propTypes";

import { focusStyle } from "constants/theme";

export const primaryButton = css`
  --color-text: ${({ theme }) => theme.colors.white};
  --color-bg: ${({ theme }) => theme.colors.primary};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.secondary)};
    border-color: var(--color-bg);
  }
`;

export const secondaryButton = css`
  --color-text: ${({ theme }) => theme.colors.primary};
  --color-bg: ${({ theme }) => theme.colors.white};
  border: 1px solid var(--color-text);

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => theme.colors.secondary};
    border-color: var(--color-bg);
  }
`;

export const tertiaryButton = css`
  --color-text: ${({ theme }) => theme.colors.primary};
  --color-bg: transparent;
  border: 1px solid transparent;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => theme.colors.primary};
  }
`;

export const tertiaryLightButton = css`
  ${tertiaryButton};

  --color-text: ${({ theme }) => theme.colors.white};

  &:hover {
    --color-text: ${({ theme }) => theme.colors.black};
    --color-bg: ${({ theme }) => theme.colors.white};
  }
`;

export const positiveButton = css`
  --color-text: ${({ theme }) => theme.colors.white};
  --color-bg: ${({ theme }) => theme.colors.positive};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.positive)};
    border-color: var(--color-bg);
  }
`;

export const negativeButton = css`
  --color-text: ${({ theme }) => theme.colors.white};
  --color-bg: ${({ theme }) => theme.colors.negative};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.negative)};
    border-color: var(--color-bg);
  }
`;

export const navigationButton = css`
  --color-text: ${({ theme }) => theme.colors.grey};
  --color-bg: ${({ theme }) => theme.colors.black};

  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: 0;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.lighterGrey};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.textLight)};
    border-color: var(--color-bg);
    border-bottom: 1px solid ${({ theme }) => theme.colors.white};
    border-radius: 0;
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.tertiary};
    box-shadow: 0;
    outline: 0;

    --color-text: ${({ theme }) => theme.colors.black};
  }
`;

export const navigationModalButton = css`
  --color-text: ${({ theme }) => theme.colors.grey};
  --color-bg: ${({ theme }) => theme.colors.black};

  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: 0;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.lighterGrey};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.textLight)};
    border-color: var(--color-bg);
    border-bottom: 1px solid ${({ theme }) => theme.colors.white};
    border-radius: 0;
  }
`;
export const navigationOnButton = css`
  --color-text: ${({ theme }) => theme.colors.black};
  --color-bg: ${({ theme }) => theme.colors.tertiary};

  position: relative;
  border-bottom: 1px solid ${({ theme }) => theme.colors.black};
  border-radius: 0;
`;

export const signoutButton = css`
  color: ${({ theme }) => theme.colors.black};

  --color-text: ${({ theme }) => theme.colors.black};
  --color-bg: ${({ theme }) => theme.colors.black};

  position: relative;
  border-radius: 0;

  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.colors.orange)};

    --color-text: ${({ theme }) => darken(0.1, theme.colors.black)};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.orange)};
    border-color: var(--color-bg);
    border-radius: 0;
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.tertiary};
    box-shadow: 0;
    outline: 0;

    --color-text: ${({ theme }) => theme.colors.black};
  }
`;

export const greyedButton = css`
  --color-text: ${({ theme }) => theme.colors.white};
  --color-bg: ${({ theme }) => theme.colors.grey};

  position: relative;
  border: none;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => darken(0.1, theme.colors.grey)};
    border-color: var(--color-bg);
  }
`;

export const navHeaderButton = css`
  --color-text: ${({ theme }) => theme.colors.white};
  --color-bg: ${({ theme }) => theme.colors.darkGrey};

  border: none;
  border-radius: 0;

  &:hover {
    --color-text: ${({ theme }) => theme.colors.white};
    --color-bg: ${({ theme }) => theme.colors.black};
    border-radius: 0;
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkGrey};
    box-shadow: 0;
    outline: 0;

    --color-text: ${({ theme }) => theme.colors.white};
  }
`;

export const navAddMenuButton = css`
  --color-text: ${({ theme }) => theme.colors.black};
  --color-bg: ${({ theme }) => theme.colors.tertiary};

  border: none;
  border-radius: 0;

  justify-content: left;
  font-size: 0.9em;
  padding: 0.2em 1.6em;
  white-space: nowrap;

  &:hover {
    --color-bg: ${({ theme }) => theme.colors.greyedOrange};
    border-radius: 0;
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.darkGrey};
    box-shadow: 0;
    outline: 0;

    --color-text: ${({ theme }) => theme.colors.white};
  }

  &[disabled] {
    --color-text: ${({ theme }) => theme.colors.disabledGreyOnOrange};
    opacity: 1;

    span {
      svg {
        path {
          fill: ${({ theme }) => theme.colors.disabledGreyOnOrange};
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
  border-radius: ${({ theme }) => theme.radius};
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
