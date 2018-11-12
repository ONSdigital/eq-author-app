import React from "react";
import { storiesOf } from "@storybook/react";
import QuestionnaireMeta from "components/QuestionnaireMeta";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

const Background = styled.span`
  padding: 1em;
  display: block;
  max-width: 40em;
`;

storiesOf("QuestionnaireMeta", module)
  .addDecorator(story => <Background>{story()}</Background>)
  .add("Empty", () => (
    <QuestionnaireMeta
      questionnaire={{
        id: "1",
        title: "",
        description: "",
        navigation: true,
        theme: "census"
      }}
      onUpdate={action("update")}
      onSubmit={action("submit")}
      confirmText="Confirm"
    />
  ))
  .add("Prefilled", () => (
    <QuestionnaireMeta
      questionnaire={{
        id: "1",
        title: "Monthly Business Survey",
        description: "Nullam id dolor id nibh ultricies vehicula ut id elit.",
        navigation: true,
        theme: "census"
      }}
      onUpdate={action("update")}
      onSubmit={action("submit")}
      confirmText="Confirm"
    />
  ));
