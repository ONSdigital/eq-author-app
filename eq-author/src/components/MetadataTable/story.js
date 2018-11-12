import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import MetadataTable from "components/MetadataTable";

import mock from "components/MetadataTable/mock";

const Wrapper = styled.div`
  position: absolute;
  padding: 2em;
`;

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

const handleUpdate = () =>
  new Promise(resolve => {
    resolve("onUpdate");
  });

storiesOf("MetadataTable", module)
  .addDecorator(Decorator)
  .add("Default", () => (
    <MetadataTable
      metadata={mock}
      questionnaireId="1"
      onAdd={action("onAdd")}
      onUpdate={handleUpdate}
      onDelete={action("onDelete")}
    />
  ));
