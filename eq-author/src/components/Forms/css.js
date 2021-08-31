import { css } from "styled-components";
import { colors, focusStyle } from "constants/theme";

const invalidStyle = css`
  border-color: ${colors.errorPrimary};
  &:focus,
  &:focus-within {
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
    box-shadow: 0 0 0 2px ${colors.errorPrimary};
  }
  &:hover {
    border-color: ${colors.errorPrimary};
    outline-color: ${colors.errorPrimary};
  }
`;

export const sharedStyles = css`
  font-size: 1em;
  border: thin solid ${colors.borders};
  padding: 0.5em;
  color: ${colors.black};
  display: block;
  width: 100%;
  transition: outline-color 100ms ease-in, border-color 100ms ease-in;
  outline: thin solid transparent;

  &:hover {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1pt ${colors.blue};
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
    border-style: solid;
    border-color: ${colors.primary};
  }

  &[disabled] {
    opacity: 0.8;
    pointer-events: none;
  }

  ${(props) => props.invalid && invalidStyle};
`;
