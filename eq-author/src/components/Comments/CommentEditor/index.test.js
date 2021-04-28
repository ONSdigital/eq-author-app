import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import CommentEditor from ".";

describe("Comment editor", () => {
  let mockOnCancel, mockOnConfirm, mockCommentText;

  const renderCommentEditor = (props) =>
    render(
      <CommentEditor
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        {...props}
      />
    );

  beforeEach(() => {
    mockOnCancel = jest.fn();
    mockOnConfirm = jest.fn();
    mockCommentText = "How many frog eggs did baby Yoda eat?";
  });

  it("Can render", () => {
    const { getByTestId } = renderCommentEditor();

    const editor = getByTestId("CommentEditor");

    expect(editor).toBeVisible();
  });

  it("Disables the confirm button if the input box is empty", () => {
    const { getByTestId } = renderCommentEditor();

    const input = getByTestId("CommentEditor__Input");
    const confirmButton = getByTestId("CommentEditor__ConfirmBtn");

    expect(input).toHaveTextContent("");
    expect(confirmButton).toBeDisabled();
  });

  it("Enables the confirm button if the input box has content", () => {
    const { getByTestId } = renderCommentEditor();

    const input = getByTestId("CommentEditor__Input");
    const confirmButton = getByTestId("CommentEditor__ConfirmBtn");

    expect(input).toHaveTextContent("");
    expect(confirmButton).toBeDisabled();

    fireEvent.change(input, { target: { value: mockCommentText } });
    input.blur();

    expect(input).toHaveTextContent(mockCommentText);
    expect(confirmButton).toBeEnabled();
  });

  it("Calls the onConfirm function when the confirm button is pressed", () => {
    const { getByTestId } = renderCommentEditor();

    const input = getByTestId("CommentEditor__Input");
    const confirmButton = getByTestId("CommentEditor__ConfirmBtn");

    fireEvent.change(input, { target: { value: mockCommentText } });
    input.blur();

    confirmButton.click();

    expect(mockOnConfirm.mock.calls.length).toBe(1);
  });

  it("Shows the cancel button when 'canClose' is given as a prop", () => {
    const { getByTestId } = renderCommentEditor({ canClose: true });

    const cancelButton = getByTestId("CommentEditor__CancelBtn");

    expect(cancelButton).toBeVisible();
  });

  it("Calls the onCancel function when the cancel button is pressed", () => {
    const { getByTestId } = renderCommentEditor({ canClose: true });

    const cancelButton = getByTestId("CommentEditor__CancelBtn");

    cancelButton.click();

    expect(mockOnCancel.mock.calls.length).toBe(1);
  });
});
