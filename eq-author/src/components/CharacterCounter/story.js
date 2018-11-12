import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import CharacterCounter from "components/CharacterCounter";

const Wrapper = styled.div`
  position: absolute;
  padding: 2em;
`;

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

storiesOf("CharacterCounter", module)
  .addDecorator(Decorator)
  .add("Less than limit", () => <CharacterCounter value="FooBar" limit={8} />)
  .add("Greater than limit", () => (
    <CharacterCounter value="FooBarFooBar" limit={8} />
  ));
