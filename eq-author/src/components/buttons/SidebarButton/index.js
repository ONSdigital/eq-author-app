import styled, { css } from "styled-components";
import { colors, radius } from "constants/theme";
import chevron from "./icon-chevron.svg";

const SidebarButton = styled.button.attrs({ role: "button" })`
  display: block;
  width: 100%;
  padding: 0.5em;
  margin-bottom: 0.5em;
  color: ${colors.text};
  border-radius: ${radius};
  border: 1px solid ${colors.bordersLight};
  text-align: left;
  font-size: 1em;
  transition: all 100ms ease-out;
  position: relative;
  cursor: pointer;
  background: ${colors.white};

  &:hover {
    border: 1px solid ${colors.borders};
    background: ${colors.lighterGrey};
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }

  &::after {
    content: "";
    display: block;
    width: 1em;
    height: 1em;
    background: url(${chevron}) no-repeat center;
    position: absolute;
    right: 0.5em;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  &:disabled {
    background: ${colors.lighterGrey};
  }

  ${props =>
    props.hasError &&
    css`
      border-color: ${colors.red};
      &:focus,
      &:focus-within {
        border-color: ${colors.red};
        outline-color: ${colors.red};
        box-shadow: 0 0 0 2px ${colors.red};
      }
      &:hover {
        border-color: ${colors.red};
        outline-color: ${colors.red};
      }
    `}
`;

export const Title = styled.span`
  display: block;
  color: ${colors.darkGrey};
  font-size: 0.9em;

  &:not(:only-child) {
    margin-bottom: 0.25rem;
  }
`;

export const Detail = styled.span`
  display: block;
  color: ${colors.black};
`;

export default SidebarButton;
