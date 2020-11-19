import styled, { css } from "styled-components";
import { colors, radius, focusStyle, disabledStyle } from "constants/theme";
import Icon from "./icon-search.svg";

export const Wrapper = styled.div`
  box-sizing: border-box;
  width: 400px;
`;

export const SimpleInput = styled.input`
  appearance: none;
  background: white url('${Icon}') no-repeat left center;
  border-radius: ${radius};
  border: ${({ hasError }) =>
    hasError ? `2px solid ${colors.red}` : `thin solid ${colors.lightGrey}`};
  box-sizing: border-box;
  color: ${colors.black};
  display: block;
  font-size: 1em;
  line-height: 1.2;
  padding: 0.25em 0.75em 0.25em 2em;
  outline: thin solid transparent;
  transition: opacity 100ms ease-in-out;
  width: 100%;

  &[disabled] {
    ${disabledStyle}
  }

  &:focus {
    border: 1px solid ${colors.primary};
    outline: none;
  }

  &:focus,
  &:focus-within {
    ${focusStyle};
  }

  &:hover {
    border-color: ${colors.blue};
    outline-color: none;
  }

  &::placeholder {
    color: #a3a3a3;
  }

`;

export const DropDown = styled.ul`
  background-color: ${colors.white};
  border: 1px solid ${colors.lightGrey};
  border-bottom-left-radius: ${radius};
  border-bottom-right-radius: ${radius};
  color: ${colors.darkGrey};
  margin: -0.05em 0 0 1.8em;
  max-height: 7em;
  padding-left: 0;
  overflow-y: auto;
`;

const commonListStateStyling = css`
  background-color: ${colors.primary};
  color: ${colors.white};
`;

export const ListItem = styled.li`
  background-color: ${colors.white};
  color: ${colors.darkGrey};
  display: block;
  margin: 0.1em 0;
  padding: 0.2em;
  padding-left: 0.5em;

  &:hover {
    ${commonListStateStyling}
  }

  &:focus {
    ${commonListStateStyling}
    outline: none;
  }
`;
