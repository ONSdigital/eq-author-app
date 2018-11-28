import React from "react";
import { storiesOf } from "@storybook/react";
import AnswerTypeSelector from "./index";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25em;
  margin: auto;
  height: 100vh;
`;

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

storiesOf("AnswerTypeSelector", module)
  .addDecorator(Decorator)
  .add("Default", () => (
    <AnswerTypeSelector
      answerCount={1}
      onSelect={action("Answer type selected")}
    />
  ));
