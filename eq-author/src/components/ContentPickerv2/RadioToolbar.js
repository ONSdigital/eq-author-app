import React from "react";
import styled from "styled-components";

import Input from "components-themed/Input";
import { Field, Label } from "components/Forms";

const StyledRadioInput = styled(Input)`
  position: relative;
  margin-right: 0.5em;
`;

const StyledLabel = styled(Label)`
  margin-top: 0.3em;
  margin-right: 2em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.open ? "0.4em" : "2em")};
  > * {
    margin-bottom: 0;
  }
`;

const RadioToolbar = ({ selectedRadio, setContentView }) => {
  return (
    <InlineField>
      <StyledRadioInput
        id="answer-picker-answer-radio"
        type="radio"
        checked
        onChange={() => console.log("radio answer clicked")}
      />
      <StyledLabel htmlFor="answer-picker-answer-radio" bold={false}>
        Answer
      </StyledLabel>
      <StyledRadioInput
        id="answer-picker-metadata-radio"
        type="radio"
        onChange={() => console.log("radio metadata clicked")}
      />
      <StyledLabel htmlFor="answer-picker-metadata-radio" bold={false}>
        Metadata
      </StyledLabel>
    </InlineField>
  );
};

export default RadioToolbar;
