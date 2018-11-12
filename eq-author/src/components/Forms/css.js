import { css } from "styled-components";
import { colors } from "constants/theme";

export const focusStyle = css`
  border-color: ${colors.blue};
  outline-color: ${colors.blue};
  box-shadow: 0 0 0 3px ${colors.tertiary};
`;

const invalidStyle = css`
  border-color: ${colors.red};
  &:focus {
    border-color: ${colors.red};
    outline-color: ${colors.red};
  }
  &:hover {
    border-color: ${colors.red};
    outline-color: ${colors.red};
  }
`;

export const sharedStyles = css`
  font-size: 1em;
  border: 1px solid ${colors.borders};
  padding: 0.5em;
  color: ${colors.black};
  display: block;
  width: 100%;
  transition: outline-color 100ms ease-in, border-color 100ms ease-in;
  outline: 1px solid transparent;

  &:hover {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
  }

  &:focus,
  &:focus-within {
    ${focusStyle};
  }

  &::placeholder {
    color: #a3a3a3;
  }

  &:focus {
    outline: none;
    border: 1px solid ${colors.primary};
  }

  &[disabled] {
    opacity: 0.8;
    pointer-events: none;
  }

  ${props => props.invalid && invalidStyle};
`;
