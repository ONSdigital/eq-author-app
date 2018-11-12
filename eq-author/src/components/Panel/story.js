import React from "react";
import { storiesOf } from "@storybook/react";
import Panel from "components/Panel";
import styled from "styled-components";

const Background = styled.span`
  padding: 1em;
  display: block;
  max-width: 20em;
`;

storiesOf("Panel", module)
  .addDecorator(story => <Background>{story()}</Background>)
  .add("Default", () => (
    <Panel>
      <p>
        Curabitur blandit tempus porttitor. Fusce dapibus, tellus ac cursus
        commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit
        amet risus. Curabitur blandit tempus porttitor. Donec ullamcorper nulla
        non metus auctor fringilla. Curabitur blandit tempus porttitor. Aenean
        lacinia bibendum nulla sed consectetur. Donec sed odio dui.
      </p>
    </Panel>
  ));
