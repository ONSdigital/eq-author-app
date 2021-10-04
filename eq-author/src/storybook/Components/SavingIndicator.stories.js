import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";
import { colors } from "constants/theme";

import { UnconnectedSavingIndicator } from "components/EditorLayout/Header/SavingIndicator";

export default {
  title: "Components/Saving Indicator",
  component: UnconnectedSavingIndicator,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            A text and icon control that displays and fades when making changes
            to text fields on section page or shortcode, question text, answer
            label and description on question pages plus changes to metadata.
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const UnconnectedSavingIndicatorTemplate = (args) => (
  <div style={{ background: colors.primary, padding: "2em" }}>
    <UnconnectedSavingIndicator isSaving {...args} />
  </div>
);

export const Default = UnconnectedSavingIndicatorTemplate.bind({});
Default.args = {
  minDisplayTime: 1000,
};
