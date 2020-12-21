import styled, { css } from "styled-components";
import { darken } from "polished";
import { colors, radius } from "constants/theme";
import { Input } from "components/Forms";
import Icon from "./icon-search.svg";

export const ScrollPaneCSS = css`
  -webkit-background-clip: text;
  transition: background-color 0.2s;
  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    box-shadow: none;
    background-color: ${colors.lightGrey};
    transition: background-color 0.2s;
  }
  ::-webkit-scrollbar-track {
    border-radius: 0;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.1);
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  > :first-child {
    backface-visibility: hidden !important;
  }
  &:hover {
    &::-webkit-scrollbar-thumb {
      background-color: ${darken(0.1, colors.lightGrey)};
    }
  }
`;

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
    css`
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
  ${ScrollPaneCSS}
`;

const commonListStateStyling = css`
  background-color: ${colors.primary};
  color: ${colors.white};
`;

export const ListItem = styled.li`
  background-color: ${props =>
    props.category ? colors.lightMediumGrey : colors.white};
  color: ${colors.darkGrey};
  display: block;
  margin: 0.1em 0;
  padding: 0.2em;
  padding-left: 0.5em;
  ${props =>
    !props.category &&
    css`
      &:hover {
        ${commonListStateStyling}
      }

      &:focus {
        ${commonListStateStyling}
        outline: none;
      }
    `}
`;
