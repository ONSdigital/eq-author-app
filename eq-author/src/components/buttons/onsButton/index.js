import React from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { darken } from "polished";

import { radius, colors, focusStyle } from "constants/theme";

const propTypes = {
  variant: PropTypes.oneOf(["primary", "inverse"]),
  small: PropTypes.bool,
  text: PropTypes.string,
  iconPosition: PropTypes.oneOf(["before", "after"]),
};

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

export const inverseButton = css`
  --color-text: ${colors.primary};
  --color-bg: transparent;
  border: 1px solid ${colors.primary};

  &:hover {
    --color-text: ${colors.white};
    --color-bg: ${colors.primary};
  }
`;

export const smallButton = css`
  padding: 0;
`;

const OnsButton = ({ text, variant, ...otherProps }) => {
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
    ${(props) => props.variant === "inverse" && inverseButton};
    ${(props) => props.small && smallButton};
    ${(props) => props.text};
    ${(props) => props.iconType};
    ${(props) => props.iconPosition};
    ${(props) => props.url};
  `;

  return (
    <Button>
      <span>{text}</span>
    </Button>
  );
};

OnsButton.propTypes = {
  ...propTypes,
  type: PropTypes.oneOf(["button", "submit"]),
};

OnsButton.defaultProps = {
  type: "button",
  variant: "primary",
};

export default OnsButton;
