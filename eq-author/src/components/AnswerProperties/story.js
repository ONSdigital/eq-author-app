import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AnswerProperties from "components/AnswerProperties";
import styled from "styled-components";
import { NUMBER } from "constants/answer-types";

const Background = styled.div`
  padding: 1em;
  display: block;
  max-width: 20em;
`;

const answer = {
  id: "1",
  index: "0",
  title: "answer-title",
  description: "answer-description",
  type: NUMBER,
  properties: {
    decimals: 2,
    required: true
  }
};

storiesOf("Properties/Answer", module).add("With multiple properties", () => (
  <Background>
    <AnswerProperties answer={answer} onUpdateAnswer={action} />
  </Background>
));
