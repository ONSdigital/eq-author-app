import React from "react";
import { Input, Select } from "components/Forms";
import Path from "../path.svg?inline";
import ValidationTitle from "../ValidationTitle";
import ValidationError from "components/ValidationError";
import styled from "styled-components";

const DateInput = styled(Input)`
  width: 12em;
  height: 2.5em;
`;

const ConnectedPath = styled(Path)`
  height: 3.6em;
`;

const RelativePositionSelect = styled(Select)`
  width: 6em;
`;

const RelativePositionText = styled(ValidationTitle)`
  margin-top: 0.5em;
  margin-bottom: 0.5em;
`;

const StartDateText = styled.div`
  margin: 0;
  padding-top: 0.5em;
  height: 2.5em;
`;

const StyledError = styled(ValidationError)`
  justify-content: start;
  width: 60%;
`;

const Now = () => (
  <StartDateText>The date the respondent begins the survey</StartDateText>
);

export {
  StyledError,
  RelativePositionText,
  RelativePositionSelect,
  ConnectedPath,
  DateInput,
  Now,
};
