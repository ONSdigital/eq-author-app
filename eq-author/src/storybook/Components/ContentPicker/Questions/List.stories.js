import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import List from "components/ContentPickerv2/QuestionPickerV2/List";
import Item from "components/ContentPickerv2/QuestionPickerV2/Item";

import { ReactComponent as FolderIcon } from "assets/icon-folder.svg";

export default {
  title: "Components/Content picker/Questions/List",
  component: List,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            The list wraps around item components to make them into an ordered
            list. The sublist classname can be passed to apply padding of 2em on
            the left to visually illustrate that the list is a sublist.
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const Template = (args) => (
  <List {...args}>
    <Item variant="heading" title="Pets">
      <List>
        <Item
          title="How many dogs do you have?"
          subtitle="Tell us about how many pets you have."
        />
        <Item
          title="How many cats do you have?"
          subtitle="Tell us about how many pets you have."
        />
        <Item
          title="How many fish do you have?"
          subtitle="Tell us about how many pets you have."
        />
        <Item
          title="How many rats do you have?"
          subtitle="Tell us about how many pets you have."
        />
        <Item
          title="How many birds do you have?"
          subtitle="Tell us about how many pets you have."
        />
      </List>
    </Item>
    <Item variant="heading" title="Cars">
      <List>
        <Item
          title="What is your favorite colour of car?"
          subtitle="What is your favorite colour of car?"
        />
        <Item icon={<FolderIcon />} title="Owned" unselectable>
          <List className="sublist">
            <Item
              title="How many cars do you own?"
              subtitle="How many cars do you own?"
            />
            <Item
              title="Why do you own a car?"
              subtitle="Why do you own a car?"
            />
          </List>
        </Item>
        <Item icon={<FolderIcon />} title="Leased" unselectable>
          <List className="sublist">
            <Item
              title="How many cars do you lease?"
              subtitle="How many cars do you lease?"
            />
            <Item
              title="Why do you lease a car?"
              subtitle="Why do you lease a car?"
            />
          </List>
        </Item>
        <Item title="Do you like cars?" subtitle="Do you like cars?" />
      </List>
    </Item>
  </List>
);

export const Default = Template.bind({});
Default.args = {};
