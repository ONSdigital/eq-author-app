import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import ButtonGroup from "components/ButtonGroup";
import Button from "components/Button";

const Width = styled.div`
  max-width: 30em;
  padding: 2em;
`;

storiesOf("ButtonGroup", module)
  .addDecorator(story => <Width>{story()}</Width>)
  .add("Vertical", () => (
    <ButtonGroup vertical>
      <Button primary>Button 1</Button>
      <Button secondary>Button 2</Button>
      <Button tertiary>Button 3</Button>
    </ButtonGroup>
  ))
  .add("Horizontal", () => (
    <ButtonGroup horizontal>
      <Button primary>Button 1</Button>
      <Button secondary>Button 2</Button>
      <Button tertiary>Button 3</Button>
    </ButtonGroup>
  ));
