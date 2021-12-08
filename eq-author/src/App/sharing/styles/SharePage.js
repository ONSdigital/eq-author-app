import styled from "styled-components";

import { Grid } from "components/Grid";
import { colors } from "constants/theme";
import MainCanvas from "components/MainCanvas";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

export const StyledGrid = styled(Grid)`
  overflow: hidden;
  padding-top: 2em;
  &:focus {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
  &:focus:not(:focus-visible) {
    border: none;
    margin: 0;
    outline: none;
  }
`;

export const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 0.5em 0 1em;
  max-width: 80em;
`;
