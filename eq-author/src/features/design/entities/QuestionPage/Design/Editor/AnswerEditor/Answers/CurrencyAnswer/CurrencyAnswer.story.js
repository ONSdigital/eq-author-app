import React from "react";
import { storiesOf } from "@storybook/react";
import CurrencyAnswer from "components/Answers/CurrencyAnswer";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";

const Background = styled.div`
  padding: 1em;
  display: block;
  max-width: 20em;
`;

storiesOf("AnswerTypes/CurrencyAnswer", module)
  .addDecorator(story => <Background>{story()}</Background>)
  .add("Empty", () => (
    <CurrencyAnswer
      answer={{ id: "", label: "", description: "" }}
      onChange={action("changed")}
      onUpdate={action("updated")}
    />
  ))
  .add("Prefilled", () => (
    <CurrencyAnswer
      answer={{
        id: "1",
        label: "Lorem ipsum",
        description: "Nullam id dolor id nibh ultricies."
      }}
      onChange={action("changed")}
      onUpdate={action("updated")}
    />
  ));
