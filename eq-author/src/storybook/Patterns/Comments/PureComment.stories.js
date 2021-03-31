import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import PureComment from "components/Comments/PureComment";

export default {
  title: "Patterns/Comments/Pure Comment",
  component: PureComment,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            A basic comment that facilitates modifying and deleting.
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const PureCommentTemplate = (args) => <PureComment {...args} />;

export const Default = PureCommentTemplate.bind({});
Default.args = {
  commentId: "1",
  author: "Jane Doe",
  datePosted: "2021-03-30T14:48:00.000Z",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  onUpdateComment: () => alert("Comment updated"),
  onDeleteComment: () => alert("Comment deleted"),
};
