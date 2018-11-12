import React from "react";
import { storiesOf } from "@storybook/react";
import DateRange from "./index";
import styled from "styled-components";

const Background = styled.div`
  padding: 1em;
`;

storiesOf("Answers/Dummy/DateRange", module)
  .addDecorator(story => <Background>{story()}</Background>)
  .add("Empty", () => <DateRange />);
