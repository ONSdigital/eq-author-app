import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import { UnconnectedSavingIndicator } from "components/SavingIndicator";

const Padding = styled.div`
  padding: 2em;
`;

storiesOf("Saving Indicator", module)
  .addDecorator(story => <Padding>{story()}</Padding>)
  .add("Primary", () => <UnconnectedSavingIndicator isSaving hasError />);
