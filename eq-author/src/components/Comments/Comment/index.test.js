import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import Comment from ".";

describe("Comment", () => {
  let mockComment,
    mockReplies,
    mockOnAddReply,
    mockOnDeleteReply,
    mockOnUpdateReply,
    mockOnUpdateComment,
    mockOnDeleteComment;

  beforeEach(() => {
    mockComment = {
      id: "1",
      author: "Jane Doe",
      datePosted: "2021-03-30T14:48:00.000Z",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    };

    mockReplies = [
      {
        id: "1.1",
        author: "Joe Bloggs",
        datePosted: "2021-03-30T14:58:00.000Z",
        text:
          "Nunc hendrerit turpis sed lacus pharetra gravida tristique ac ligula.",
        dateModified: "2021-03-30T15:48:00.000Z",
      },
    ];

    mockOnAddReply = jest.fn();
    mockOnDeleteReply = jest.fn();
    mockOnUpdateReply = jest.fn();
    mockOnUpdateComment = jest.fn();
    mockOnDeleteComment = jest.fn();
  });

  it("Can render", () => {
    const { getByTestId } = render(
      <Comment
        comment={mockComment}
        replies={mockReplies}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        onAddReply={mockOnAddReply}
        onUpdateReply={mockOnUpdateReply}
        onDeleteReply={mockOnDeleteReply}
      />
    );

    const comment = getByTestId("Comment");

    expect(comment).toBeVisible();
  });

  it("Does not render '(Show/Hide) x replies' if there are none", () => {
    const { queryByTestId } = render(
      <Comment
        comment={mockComment}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        onAddReply={mockOnAddReply}
        onUpdateReply={mockOnUpdateReply}
        onDeleteReply={mockOnDeleteReply}
      />
    );

    const replies = queryByTestId("collapsible");

    expect(replies).not.toBeInTheDocument();
  });

  it("Does render '(Show/Hide) x replies' when there are some", () => {
    const { getByTestId } = render(
      <Comment
        comment={mockComment}
        replies={mockReplies}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        onAddReply={mockOnAddReply}
        onUpdateReply={mockOnUpdateReply}
        onDeleteReply={mockOnDeleteReply}
      />
    );

    const replies = getByTestId("collapsible");

    expect(replies).toBeVisible();
  });

  it("Makes 'reply' plural when there are more than one", () => {
    const { getByTestId, rerender } = render(
      <Comment
        comment={mockComment}
        replies={mockReplies}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        onAddReply={mockOnAddReply}
        onUpdateReply={mockOnUpdateReply}
        onDeleteReply={mockOnDeleteReply}
      />
    );

    const repliesCollapsibleTitle = getByTestId("collapsible-title");

    expect(mockReplies.length).toBe(1);
    expect(repliesCollapsibleTitle).toHaveTextContent(`Show 1 reply`);

    mockReplies.push({
      id: "1.2",
      author: "Jane Doe",
      datePosted: "2021-03-30T16:48:00.000Z",
      text:
        "Nunc hendrerit turpis sed lacus pharetra gravida tristique ac ligula.",
    });

    rerender(
      <Comment
        comment={mockComment}
        replies={mockReplies}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        onAddReply={mockOnAddReply}
        onUpdateReply={mockOnUpdateReply}
        onDeleteReply={mockOnDeleteReply}
      />
    );

    expect(mockReplies.length).toBe(2);
    expect(repliesCollapsibleTitle).toHaveTextContent(`Show 2 replies`);
  });

  it("Hides the 'Reply' button when the 'disableReplies' prop is given", () => {
    const { queryByTestId } = render(
      <Comment
        comment={mockComment}
        replies={mockReplies}
        disableReplies
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        onAddReply={mockOnAddReply}
        onUpdateReply={mockOnUpdateReply}
        onDeleteReply={mockOnDeleteReply}
      />
    );

    const replyBtn = queryByTestId("Comment__ReplyBtn");

    expect(replyBtn).not.toBeInTheDocument();
  });
});