import styled from "styled-components";
import { colors, radius } from "constants/theme";
import chevron from "./icon-chevron.svg";

const SidebarButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.5em;
  margin-bottom: 0.5em;
  color: ${colors.text};
  border: none;
  border-radius: ${radius};
  border: 1px solid ${colors.bordersLight};
  text-align: left;
  font-size: 1em;
  transition: all 100ms ease-out;
  position: relative;
  cursor: pointer;

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
`;

export const Title = styled.span`
  display: block;
  color: ${colors.darkGrey};

  &:not(:only-child) {
    margin-bottom: 0.25rem;
  }
`;

export const Detail = styled.span`
  display: block;
  color: ${colors.black};
`;

export default SidebarButton;
