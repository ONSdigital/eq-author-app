import styled, { css } from "styled-components";
import { Input } from "components/Forms";
import { colors, radius } from "constants/theme";
import Icon from "./icon-search.svg";

export const Wrapper = styled.div`
  box-sizing: border-box;
`;

export const RoundedInput = styled(Input)`
  background: white url('${Icon}') no-repeat left center;
  border-radius: ${radius};
  box-sizing: border-box;
  padding-left: 2em;
  outline: none;
  &::placeholder {
    color: ${colors.darkGrey};
  }
  ${({ hasError }) =>
    hasError &&
    `
  border-color: ${colors.red};
`}
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
