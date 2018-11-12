import React from "react";
import { storiesOf } from "@storybook/react";
import Tooltip from "components/Tooltip";
import Button from "components/Button";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  padding: 2em;
`;

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

storiesOf("Tooltip", module)
  .addDecorator(Decorator)
  .add("Default", () => (
    <Tooltip content="I'm a tooltip!">
      <Button primary>Hover me!</Button>
    </Tooltip>
  ));
