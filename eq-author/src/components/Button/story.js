import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import Button from "components/Button";
import LinkButton from "components/Button/LinkButton";
import RouteButton from "components/Button/RouteButton";
import IconText from "components/IconText";
import { MemoryRouter } from "react-router";
import icon from "./test-icon.svg?inline";

const Padding = styled.div`
  padding: 2em;
`;

const DarkBg = styled.div`
  background: #333;
  padding: 1em;
`;

storiesOf("Button", module)
  .addDecorator(story => <Padding>{story()}</Padding>)
  .add("Primary", () => (
    <Button onClick={action("click")}>Create survey</Button>
  ))
  .add("Primary with Icon", () => (
    <Button onClick={action("click")} small>
      <IconText icon={icon}>Label</IconText>
    </Button>
  ))
  .add("Secondary", () => (
    <Button onClick={action("click")} variant="secondary">
      Cancel
    </Button>
  ))
  .add("Secondary with icon", () => (
    <Button onClick={action("click")} variant="secondary" small>
      <IconText icon={icon} dark>
        Label
      </IconText>
    </Button>
  ))
  .add("Tertiary", () => (
    <Button onClick={action("click")} variant="tertiary">
      Abort
    </Button>
  ))
  .add("Tertiary with Icon", () => (
    <Button onClick={action("click")} variant="tertiary" small>
      <IconText icon={icon} dark>
        Label
      </IconText>
    </Button>
  ))
  .add("Tertiary - Light", () => (
    <DarkBg>
      <Button onClick={action("click")} variant="tertiary-light">
        Abort
      </Button>
    </DarkBg>
  ))
  .add("Tertiary - Light with Icon", () => (
    <DarkBg>
      <Button onClick={action("click")} variant="tertiary-light" small>
        <IconText icon={icon} dark>
          Label
        </IconText>
      </Button>
    </DarkBg>
  ))
  .add("LinkButton", () => (
    <LinkButton href="http://google.com">External link</LinkButton>
  ))
  .add("RouteButton", () => (
    <MemoryRouter>
      <RouteButton to="/">Internal link</RouteButton>
    </MemoryRouter>
  ));
