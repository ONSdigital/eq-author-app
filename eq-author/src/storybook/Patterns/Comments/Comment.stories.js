import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import Comment from "components/Comments/Comment";

export default {
  title: "Patterns/Comments/Comment",
  component: Comment,
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

const CommentTemplate = (args) => <Comment {...args} />;

export const Default = CommentTemplate.bind({});
Default.args = {
  commentId: "1",
  author: "Jane Doe",
  datePosted: "2021-03-30T14:48:00.000Z",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  onUpdateComment: () => alert("Comment updated"),
  onDeleteComment: () => alert("Comment deleted"),
};
