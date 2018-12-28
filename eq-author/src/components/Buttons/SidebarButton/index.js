import styled from "styled-components";
import { colors, radius } from "constants/theme";

const SidebarButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75em;
  margin-bottom: 0.5em;
  color: ${colors.text};
  border: none;
  border-radius: ${radius};
  background-color: ${colors.lightMediumGrey};

  text-align: left;
  font-size: 1em;
  transition: all 100ms ease-out;

  &:hover {
    background-color: ${colors.primary};
    cursor: pointer;
  }

  &:hover > * {
    color: white;
  }

  &:focus {
    box-shadow: 0 0 0 3px ${colors.tertiary};
    outline: none;
  }
`;

export const Title = styled.span`
  display: block;
  color: ${colors.darkGrey};

  &:not(:only-child) {
    margin-bottom: 0.5rem;
  }
`;

export const Detail = styled.span`
  display: block;
  color: ${colors.black};
`;

export default SidebarButton;
