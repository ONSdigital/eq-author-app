import React from "react";
import styled from "styled-components";
import { colors } from "constants/theme";

const ErrorText = styled.span`
  align-items: center;
  color: ${colors.darkGrey};
  display: flex;
  font-size: 1.2em;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

export const ErrorMessage = (type) => (
  <ErrorText data-test="no-previous-answers">
    {`There are no previous ${type} to pick from`}
  </ErrorText>
);
