import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import CommentEditor from "components/Comments/CommentEditor";

export default {
  title: "Patterns/Comments/Comment Editor",
  component: CommentEditor,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            A basic form for adding a new, or modifying an existing, comment.
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const CommentEditorTemplate = (args) => <CommentEditor {...args} />;

export const Default = CommentEditorTemplate.bind({});
Default.args = {
  onAdd: () => alert("Comment added"),
  onCancel: () => alert("Canceled"),
};

export const Growable = CommentEditorTemplate.bind({});
Growable.args = {
  variant: "growable",
  onAdd: () => alert("Comment added"),
  onCancel: () => alert("Canceled"),
};
