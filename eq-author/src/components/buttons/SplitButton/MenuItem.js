import styled from "styled-components";
import { colors } from "constants/theme";

const MenuItem = styled.button.attrs({
  type: "button",
})`
  font-size: 1em;
  border: none;
  text-align: left;
  border-radius: 8px;
  padding: 0.75em 1.5em;
  margin-bottom: 0.25em;
  outline: none;
  &:last-of-type {
    margin: 0;
  }

  &:focus:not(:disabled),
  &:hover:not(:disabled) {
    background: ${colors.blue};
    color: ${colors.white};
    cursor: pointer;
  }
`;

export default MenuItem;
