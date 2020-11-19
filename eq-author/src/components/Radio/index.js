import styled from "styled-components";

import { colors } from "constants/theme";

export const RadioField = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

export const RadioLabel = styled.label`
  padding: 1em 1.5em;
  border-radius: 0.25em;
  margin-bottom: 0.8em;
  margin-left: -0.5em;
  border: 1px solid ${colors.black};
  flex: 1 1 33.3333333%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  color: ${colors.textLight};
  position: relative;

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
`;

export const RadioTitle = styled.span`
  letter-spacing: 0;
  margin-left: 2em;
  margin-bottom: 0.8em;
  color: ${colors.text};
  display: flex;
`;

export const RadioDescription = styled.span`
  font-size: 0.9em;
  letter-spacing: 0;
`;
