import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import TextButton from "components/TextButton";

const Padding = styled.div`
  padding: 2em;
`;

storiesOf("TextButton", module)
  .addDecorator(story => <Padding>{story()}</Padding>)
  .add("Default", () => (
    <TextButton onClick={action("click")}>action</TextButton>
  ))
  .add("Disabled", () => <TextButton disabled>action</TextButton>);
