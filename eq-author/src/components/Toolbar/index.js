import styled from "styled-components";

// Does not use a default export as both Toolbar and ToolbarButtonContainer may require children props
export const Toolbar = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  padding: 1.5em 2em;
`;

export const ToolbarButtonContainer = styled.div`
  margin: 0 0 0 auto;
  grid-column-start: 2;
  grid-row-start: 1;
  display: grid;
  grid-gap: 0.5em;
  grid-auto-flow: column;
  padding-left: 1em;
  height: 2.125em;
`;
