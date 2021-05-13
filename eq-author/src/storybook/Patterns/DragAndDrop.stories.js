import React from "react";

import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import DragAndDrop from "components/DragAndDrop";

export default {
  title: "Patterns/Drag and drop",
  component: DragAndDrop,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const Template = (args) => <DragAndDrop {...args} />;

export const OneSection = Template.bind({});
OneSection.args = {
  sections: [
    {
      id: "section-1",
      title: "Animation movies",
      pages: [
        { id: "page-1", title: "Toy Story" },
        { id: "page-2", title: "Shrek" },
        { id: "page-3", title: "Finding Nemo" },
        { id: "page-4", title: "Finding Dory" },
      ],
    },
  ],
};
