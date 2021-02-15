import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import moment from "moment";
import "moment/locale/en-gb";

import CommentSection from "./CommentSection";

import { replyInProgress } from "components/CommentAccordion";

const props = {
  myId: "",
  index: 0,
  item: {
    id: "commentId",
    user: {
      id: "userId",
    },
    editComment: "Test comment",
    editedTime: "2021-01-22T12:54:43.577Z",
    commentText: "Original comment",
  },
  activeReplyId: "replyId",
  activeCommentId: "2",
  editComment: "Test comment",
  displayReplies: [1, 2, 3, 4],
  repliesCount: "",
  replies: [],
  reply: "",
};

const setup = props => {
  const setCommentRef = jest.fn();
  const setEditComment = jest.fn();
  const setReply = jest.fn();
  const handleSaveReply = jest.fn();
  const setActiveReplyId = jest.fn();
  const handleSaveEdit = jest.fn();
  const handleEdit = jest.fn();
  const handleDelete = jest.fn();
  const setActiveCommentId = jest.fn();
  const setReplyRef = jest.fn();
  const getInitials = jest.fn();

  const utils = render(
    <CommentSection
      {...props}
      setCommentRef={setCommentRef}
      setEditComment={setEditComment}
      setReply={setReply}
      handleSaveReply={handleSaveReply}
      setActiveReplyId={setActiveReplyId}
      handleSaveEdit={handleSaveEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      setActiveCommentId={setActiveCommentId}
      setReplyRef={setReplyRef}
      getInitials={getInitials}
    />
  );

  return {
    ...utils,
    setCommentRef,
    setEditComment,
    setReply,
    handleSaveReply,
    setActiveReplyId,
    handleSaveEdit,
    handleEdit,
    handleDelete,
    setActiveCommentId,
    setReplyRef,
    getInitials,
  };
};

const defaultSetup = () => {
  const utils = setup(props);
  const reply = utils.getByText("Reply");
  return { ...utils, reply };
};

const modifiedSetup = changes => {
  const utils = setup({ ...props, ...changes });
  return { ...utils };
};

const editStateSetup = () => {
  const utils = modifiedSetup({ ...props, activeCommentId: "commentId" });

  const save = utils.getByText("Save");
  const cancel = utils.getByText("Cancel");
  const textarea = utils.getByText(props.editComment);

  return { ...utils, save, cancel, textarea };
};

describe("CommentSection", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("comment-add-section")).toBeVisible();
  });

  it("should display comment text when not editing", () => {
    const { getByText } = modifiedSetup({ ...props, activeCommentId: "2" });

    expect(getByText(props.item.commentText)).toBeVisible();
    expect(
      getByText(`Edited: ${moment(props.item.editedTime).calendar()}`)
    ).toBeVisible();
  });

  it("should render reply accordion", () => {
    const replyLength = props.displayReplies.length;
    const { getByText } = defaultSetup();

    expect(
      getByText(`Show ${replyLength} ${replyLength > 1 ? "replies" : "reply"}`)
    ).toBeVisible();
  });

  it("should handle accordion click", () => {
    const replyLength = props.displayReplies.length;
    const { getByText } = defaultSetup();

    fireEvent.click(
      getByText(`Show ${replyLength} ${replyLength > 1 ? "replies" : "reply"}`)
    );
    expect(
      getByText(`Hide ${replyLength} ${replyLength > 1 ? "replies" : "reply"}`)
    ).toBeVisible();
  });

  it("should show accordion edit in progress", () => {
    const { getByText } = modifiedSetup({
      ...props,
      activeCommentId: "commentId",
      activeReplyId: "commentId",
    });

    expect(getByText(replyInProgress)).toBeVisible();
  });

  it("should show reply edit", () => {
    const { getByTestId } = modifiedSetup({
      ...props,
      activeReplyId: "commentId",
    });

    expect(getByTestId(`btn-save-reply-${props.index}`)).toBeVisible();
    expect(getByTestId(`btn-cancel-reply-${props.index}`)).toBeVisible();
  });

  it("should be able to edit comment", () => {
    const { save, cancel, textarea } = editStateSetup();

    expect(save).toBeVisible();
    expect(cancel).toBeVisible();
    expect(textarea).toBeVisible();
  });

  it("should handle save for edit comment", () => {
    const { save, handleSaveEdit } = editStateSetup();

    fireEvent.click(save);

    expect(handleSaveEdit).toHaveBeenCalledTimes(1);
    expect(handleSaveEdit).toHaveBeenCalledWith(props.item);
  });

  it("should handle comment onChange", () => {
    const testText = "testing 123";
    const { textarea, setEditComment } = editStateSetup();

    fireEvent.change(textarea, {
      target: { value: testText },
    });

    expect(setEditComment).toHaveBeenCalledTimes(1);
    expect(setEditComment).toHaveBeenCalledWith(testText);
  });

  it("should handle cancel for edit comment", () => {
    const { cancel, setReply, setActiveCommentId } = editStateSetup();

    fireEvent.click(cancel);

    expect(setReply).toHaveBeenCalledTimes(1);
    expect(setReply).toHaveBeenCalledWith("");
    expect(setActiveCommentId).toHaveBeenCalledTimes(1);
    expect(setActiveCommentId).toHaveBeenCalledWith("");
  });

  it("should handle click", () => {
    const { getByTestId, setActiveReplyId } = modifiedSetup({
      activeCommentId: "2",
    });

    fireEvent.click(getByTestId(`btn-reply-comment-${props.index}`));

    expect(setActiveReplyId).toHaveBeenCalledTimes(1);
    expect(setActiveReplyId).toHaveBeenCalledWith(props.item.id);
  });
});
