import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import Item from "components/ContentPickerv2/QuestionPickerV2/Item";

import { ReactComponent as FolderIcon } from "assets/icon-folder.svg";

export default {
  title: "Components/Content picker/Questions/Item",
  component: Item,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet velit non ligula vulputate efficitur non sit amet ex. Aenean
            iaculis odio a lobortis tristique. Suspendisse est ipsum, finibus et
            bibendum a, hendrerit et neque. Aliquam varius porta eros, in
            suscipit libero tempor eget. Aenean eget lectus posuere, ullamcorper
            ex sed, scelerisque lacus.
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const Template = (args) => <Item {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "How many dogs do you have?",
  subtitle: "Number of pets you have",
};

export const NoSubtitle = Template.bind({});
NoSubtitle.args = {
  title: "How many dogs do you have?",
};

export const Heading = Template.bind({});
Heading.args = {
  title: "Pets",
  variant: "heading",
};

export const Selected = Template.bind({});
Selected.args = {
  title: "How many dogs do you have?",
  subtitle: "Number of pets you have",
  selected: true,
};

export const Icon = Template.bind({});
Icon.args = {
  title: "Dogs",
  icon: <FolderIcon />,
};

export const Unselectable = Template.bind({});
Unselectable.args = {
  title: "Dogs",
  icon: <FolderIcon />,
  unselectable: true,
};
