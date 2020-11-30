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
  border: 1px solid ${colors.bordersLight};
  flex: 1 1 33.3333333%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.18);
  color: ${colors.textLight};
  position: relative;
  background: ${props =>
    props.selected ? `${colors.blue}` : `${colors.white}`};

  &:hover {
    box-shadow: 0 0 0 1px ${colors.blue};
  }

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }
`;

export const RadioTitle = styled.span`
  font-weight: bold;
  letter-spacing: 0;
  margin-left: 3em;
  color: ${colors.text};
  display: flex;
`;

export const RadioDescription = styled.span`
  font-size: 1em;
  letter-spacing: 0;
  margin-left: 3em;
`;
