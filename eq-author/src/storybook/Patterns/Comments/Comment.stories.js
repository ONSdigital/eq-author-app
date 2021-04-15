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
  id: "comment-1",
  rootId: "comment-1",
  subjectId: "page-1",
  authorName: "Jane Doe",
  datePosted: "2021-03-30T14:48:00.000Z",
  dateModified: "2021-03-30T15:48:00.000Z",
  commentText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  canEdit: true,
  canDelete: true,
};
