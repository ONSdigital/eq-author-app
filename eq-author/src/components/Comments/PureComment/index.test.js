import React from "react";
import moment from "moment";

import { render } from "tests/utils/rtl";

import PureComment from ".";

describe("Pure comment", () => {
  let mockComment,
    mockOnUpdateComment,
    mockOnDeleteComment,
    mockShowAddReplyBtn,
    mockShowReplyBtn;

  beforeEach(() => {
    mockComment = {
      commentId: "1",
      author: "Jane Doe",
      datePosted: "2021-03-30T14:48:00.000Z",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    };
    mockOnUpdateComment = jest.fn();
    mockOnDeleteComment = jest.fn();
    mockShowReplyBtn = jest.fn();
    mockShowAddReplyBtn = jest.fn();
  });

  it("Can render", () => {
    const { getByTestId } = render(
      <PureComment
        {...mockComment}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        canDelete
        canEdit
      />
    );

    const comment = getByTestId("PureComment");

    expect(comment).toBeVisible();
  });

  it("Uses the authors initials for their avatar", () => {
    const { getByText } = render(
      <PureComment
        {...mockComment}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        canDelete
        canEdit
      />
    );

    const avatar = getByText("JD");

    expect(avatar).toBeVisible();
  });

  it("Converts an ISO date to the human readable date format", () => {
    const { getByText } = render(
      <PureComment
        {...mockComment}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        canDelete
        canEdit
      />
    );

    const humanReadableDate = moment(mockComment.datePosted).calendar();

    expect(getByText(humanReadableDate)).toBeVisible();
  });

  it("Opens the Comment Editor when the Edit button is clicked", () => {
    const { getByTestId } = render(
      <PureComment
        {...mockComment}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        showReplyBtn={mockShowReplyBtn}
        showAddReply={mockShowAddReplyBtn}
        canDelete
        canEdit
      />
    );

    const editBtn = getByTestId("PureComment__EditCommentBtn");

    editBtn.click();

    const commentEditor = getByTestId("CommentEditor");

    expect(commentEditor).toBeVisible();
  });

  it("Calls onDeleteComment when the delete button is clicked", () => {
    const { getByTestId } = render(
      <PureComment
        {...mockComment}
        onUpdateComment={mockOnUpdateComment}
        onDeleteComment={mockOnDeleteComment}
        canDelete
        canEdit
      />
    );

    const deleteBtn = getByTestId("PureComment__DeleteCommentBtn");

    deleteBtn.click();

    expect(mockOnDeleteComment.mock.calls.length).toBe(1);
  });
});
