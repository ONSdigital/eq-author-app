import React from "react";
import styled, { css } from "styled-components";
import PropType from "prop-types";
import { darken } from "polished";

const smallButton = css`
  font-size: 0.9rem;
  .button-text {
    padding: 0.5em 0.7em;
  }
`;

const narrowButton = css`
  font-size: 0.9rem;
  .button-text {
    padding: 0.2em 0.4em;
  }
  svg {
    height: 14px;
    width: 14px;
  }
`;

const iconLeft = css`
  svg:first-of-type {
    margin-right: ${({ narrow }) => (narrow ? "0.3rem" : "0.5rem")};
    margin-left: 0;
  }
`;

const iconRight = css`
  svg:last-of-type {
    margin-right: 0;
    margin-left: ${({ narrow }) => (narrow ? "0.3rem" : "0.5rem")};
  }
`;

const noBorders = css`
  border: 2px solid transparent;
`;

const primaryButton = css`
  color: ${({ theme }) => theme.colors.textInverse};
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: 0 3px ${({ theme }) => darken(0.15, theme.colors.primary)};

  svg {
    fill: ${({ theme }) => theme.colors.textInverse};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textInverse};
    background-color: ${({ theme }) => darken(0.1, theme.colors.primary)};
  }

  &:focus {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.focus};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }

  &:active:focus {
    color: ${({ theme }) => theme.colors.textInverse};
    background-color: ${({ theme }) => darken(0.1, theme.colors.primary)};
    box-shadow: 0 0 transparent;
    top: 3px;
    svg {
      fill: ${({ theme }) => theme.colors.textInverse};
    }
  }

  &:focus:hover:not(:active) {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => darken(0.05, theme.colors.focus)};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }
`;

const secondaryButton = css`
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.secondary};
  box-shadow: 0 3px ${({ theme }) => darken(0.5, theme.colors.secondary)};
  font-weight: normal;

  svg {
    fill: ${({ theme }) => theme.colors.text};
  }

  &:hover {
    background-color: ${({ theme }) => darken(0.1, theme.colors.secondary)};
  }

  &:focus {
    background-color: ${({ theme }) => theme.colors.focus};
    box-shadow: 0 3px ${({ theme }) => darken(0.15, theme.colors.primary)};
  }

  &:active:focus {
    background-color: ${({ theme }) => darken(0.1, theme.colors.secondary)};
    box-shadow: 0 0 transparent;
    top: 3px;
  }

  &:focus:hover:not(:active) {
    background-color: ${({ theme }) => darken(0.05, theme.colors.focus)};
    box-shadow: 0 3px ${({ theme }) => darken(0.15, theme.colors.primary)};
  }
`;

const ghostButton = css`
  color: ${({ theme }) => theme.colors.textInverse};
  border: 2px solid rgba(255, 255, 255, 0.6);
  svg {
    fill: ${({ theme }) => theme.colors.textInverse};
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
    border-color: ${({ theme }) => theme.colors.white};
  }

  &:focus {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.focus};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }

  &:active:focus {
    color: ${({ theme }) => theme.colors.textInverse};
    background-color: rgba(0, 0, 0, 0.2);
    border-color: rgba(255, 255, 255, 0.6);
    svg {
      fill: ${({ theme }) => theme.colors.textInverse};
    }
  }

  &:focus:hover:not(:active) {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => darken(0.05, theme.colors.focus)};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }
`;

const ghostButtonPrimary = css`
  color: ${({ theme }) => theme.colors.primary};
  border: 2px solid ${({ theme }) => theme.colors.primary};

  svg {
    fill: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textInverse};
    background-color: ${({ theme }) => theme.colors.primary};
    svg {
      fill: ${({ theme }) => theme.colors.textInverse};
    }
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }

  &:active:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`;

const ghostButtonWhite = css`
  color: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.white};

  svg {
    fill: ${({ theme }) => theme.colors.textInverse};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.white};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }

  &:active:focus {
    border-color: ${({ theme }) => theme.colors.focus};
  }
`;

const confirmButton = css`
  color: ${({ theme }) => theme.colors.textInverse};
  background-color: ${({ theme }) => theme.colors.positive};
  box-shadow: 0 3px ${({ theme }) => darken(0.15, theme.colors.positive)};
  pointer-events: ${(props) => props.preview && `none`};

  svg {
    fill: ${({ theme }) => theme.colors.textInverse};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.textInverse};
    background-color: ${({ theme }) => darken(0.1, theme.colors.positive)};
  }

  &:focus {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.focus};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }

  &:active:focus {
    color: ${({ theme }) => theme.colors.textInverse};
    background-color: ${({ theme }) => darken(0.1, theme.colors.positive)};
    box-shadow: 0 0 transparent;
    top: 3px;
    svg {
      fill: ${({ theme }) => theme.colors.textInverse};
    }
  }

  &:focus:hover:not(:active) {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => darken(0.05, theme.colors.focus)};
    svg {
      fill: ${({ theme }) => theme.colors.text};
    }
  }
`;

const BaseButton = styled.button`
  display: inline-flex;
  background-color: transparent;
  flex: 0 0 auto;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: ${({ theme }) => theme.radius};
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  line-height: 1.35;
  justify-content: center;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  text-decoration: none;
  transition: all 100ms ease-out;
  letter-spacing: 0;
  position: relative;
  overflow: hidden;

  .button-text {
    padding: 0.7em 1em 0.8em;
    margin: 0;
  }

  svg {
    height: 18px;
    vertical-align: middle;
    margin-top: -3px;
    width: 18px;
  }

  &[disabled] {
    pointer-events: none;
    opacity: 0.6;
  }

  ${(props) => props.variant === "primary" && primaryButton};
  ${(props) => props.variant === "secondary" && secondaryButton};
  ${(props) => props.variant === "ghost" && ghostButton};
  ${(props) => props.variant === "ghost-primary" && ghostButtonPrimary};
  ${(props) => props.variant === "ghost-white" && ghostButtonWhite};
  ${(props) => props.variant === "confirm" && confirmButton};
  ${(props) => props.small && smallButton};
  ${(props) => props.narrow && narrowButton};
  ${(props) => props.iconLeft && iconLeft};
  ${(props) => props.iconRight && iconRight};
  ${(props) => props.noBorders && noBorders};
`;

const Button = (props) => {
  return (
    <BaseButton {...props}>
      <span className="button-text">
        {(props.iconLeft || !props.children) && props.icon}
        {props.children}
        {props.iconRight && props.icon}
      </span>
    </BaseButton>
  );
};

Button.propTypes = {
  variant: PropType.string,
  children: PropType.node,
  icon: PropType.node,
  iconRight: PropType.bool,
  iconLeft: PropType.bool,
  noBorders: PropType.bool,
  preview: PropType.bool,
};

Button.defaultProps = {
  type: "button",
  variant: "primary",
  preview: false,
};

export default Button;
