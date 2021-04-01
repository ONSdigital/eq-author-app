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
            A more comprehensive comment that facilities modifying and deleting
            a route comment, as well as replying to the root comment with the
            same features.
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
  comment: {
    commentId: "1",
    author: "Jane Doe",
    datePosted: "2021-03-30T14:48:00.000Z",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  replies: [
    {
      id: "1.1",
      author: "Joe Bloggs",
      datePosted: "2021-03-30T14:58:00.000Z",
      text:
        "Nunc hendrerit turpis sed lacus pharetra gravida tristique ac ligula.",
      dateModified: "2021-03-30T15:48:00.000Z",
    },
  ],
  onAddReply: () => alert("Reply added"),
  onUpdateComment: () => alert("Comment updated"),
  onDeleteComment: () => alert("Comment deleted"),
  onUpdateReply: () => alert("Reply updated"),
  onDeleteReply: () => alert("Reply deleted"),
};

export const MultipleReplies = CommentTemplate.bind({});
MultipleReplies.args = {
  comment: {
    commentId: "1",
    author: "Jane Doe",
    datePosted: "2021-03-30T14:48:00.000Z",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  replies: [
    {
      id: "1.1",
      author: "Joe Bloggs",
      datePosted: "2021-03-30T14:58:00.000Z",
      text:
        "Nunc hendrerit turpis sed lacus pharetra gravida tristique ac ligula.",
      dateModified: "2021-03-30T15:48:00.000Z",
    },
    {
      id: "1.2",
      author: "Jane Doe",
      datePosted: "2021-03-30T16:48:00.000Z",
      text:
        "Nunc hendrerit turpis sed lacus pharetra gravida tristique ac ligula.",
    },
  ],
  onAddReply: () => alert("Reply added"),
  onUpdateComment: () => alert("Comment updated"),
  onDeleteComment: () => alert("Comment deleted"),
  onUpdateReply: () => alert("Reply updated"),
  onDeleteReply: () => alert("Reply deleted"),
};