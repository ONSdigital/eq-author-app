import React from "react";
import { storiesOf } from "@storybook/react";
import DeleteButton from "components/DeleteButton";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";

const Background = styled.div`
  padding: 1em;
  display: block;
  max-width: 20em;
`;

storiesOf("DeleteButton", module)
  .addDecorator(story => <Background>{story()}</Background>)
  .add("Small", () => <DeleteButton size="small" onClick={action("clicked")} />)
  .add("Medium", () => (
    <DeleteButton size="medium" onClick={action("clicked")} />
  ))
  .add("Large", () => (
    <DeleteButton size="large" onClick={action("clicked")} />
  ));
