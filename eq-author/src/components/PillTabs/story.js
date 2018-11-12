import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import PillTabs from "./";

const Content = styled.div`
  margin-top: 1em;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 35em;
`;

export const OPTIONS = [
  {
    id: "completion-date",
    title: "Completion date",
    render: () => (
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum
        dolorum unde, quisquam eum doloribus blanditiis error dolore nisi
        aspernatur sed beatae adipisci? Ullam, consequatur nemo saepe voluptates
        minus, sunt dolore.
      </p>
    )
  },
  {
    id: "previous-answer",
    title: "Previous answer",
    render: () => (
      <p>
        Pharetra convallis posuere morbi leo urna molestie at elementum eu
        facilisis sed odio morbi quis commodo odio aenean sed adipiscing diam
        donec adipiscing tristique risus nec feugiat in fermentum posuere
      </p>
    )
  },
  {
    id: "survey-data",
    title: "Survey data",
    render: () => (
      <p>
        Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna
        neque viverra justo nec ultrices dui sapien eget mi proin sed libero
        enim sed faucibus turpis in eu mi bibendum
      </p>
    )
  },
  {
    id: "custom",
    title: "Custom",
    render: () => (
      <p>
        Quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna
        neque viverra justo nec ultrices dui sapien eget mi proin sed libero
        enim sed faucibus turpis in eu mi bibendum
      </p>
    )
  }
];

storiesOf("PillTabs", module)
  .addDecorator(story => <Content>{story()}</Content>)
  .add("Default", () => (
    <PillTabs onChange={action("change")} options={OPTIONS} />
  ))
  .add("Updated state", () => (
    <PillTabs value="custom" onChange={action("change")} options={OPTIONS} />
  ));
