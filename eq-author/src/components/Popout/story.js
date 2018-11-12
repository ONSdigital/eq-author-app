import React from "react";
import { storiesOf } from "@storybook/react";
import Popout, { UncontrolledPopout } from "./index";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import ScaleTransition from "./ScaleTransition";

const Trigger = styled.button`
  border-radius: 2px;
  box-shadow: none;
  border: 1px solid #ccc;
  background: white;
  padding: 1em 2em;
  outline: none;

  &:active {
    background-color: #ccc;
  }

  &:focus {
    background-color: #eee;
  }
`;

const CloseButton = styled.button`
  border: none;
  background: none;
  position: absolute;
  top: 2em;
  right: 2em;
  font-size: 1em;
  font-weight: 700;
  color: #444;
  text-transform: uppercase;
`;

const Menu = styled.div`
  background-color: white;
  padding: 2em;
  box-shadow: rgba(0, 0, 0, 0.16) 0 5px 20px 0;
  width: 340px;
`;

const CenterXY = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
`;

const CenterDecorator = storyFn => <CenterXY>{storyFn()}</CenterXY>;

const trigger = <Trigger>Click me</Trigger>;
const Content = (
  { onClose } // eslint-disable-line react/prop-types
) => (
  <Menu>
    <CloseButton onClick={onClose}>×</CloseButton>
    <h2>Hello world</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. In ut ratione
      impedit, culpa cupiditate atque distinctio placeat. Beatae nam voluptas
      magnam, repellendus alias in officia nemo, voluptatum est velit vitae
    </p>
  </Menu>
);

storiesOf("Popout", module)
  .addDecorator(CenterDecorator)
  .addDecorator(withKnobs)
  .add("Stateless", () => (
    <Popout
      open={boolean("open", false)}
      trigger={trigger}
      onToggleOpen={action("toggle open")}
    >
      <Content />
    </Popout>
  ))
  .add("Stateful", () => (
    <UncontrolledPopout trigger={trigger}>
      <Content />
    </UncontrolledPopout>
  ))
  .add("Animated", () => (
    <UncontrolledPopout trigger={trigger} transition={ScaleTransition}>
      <Content />
    </UncontrolledPopout>
  ));
