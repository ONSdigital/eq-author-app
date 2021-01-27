import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import EditComment from "./EditComment";

const props = {
  displayComments: [],
  comment: "",
  setComment: jest.fn(),
  setActiveReplyId: jest.fn(),
  handleSubmit: jest.fn(),
};

it("should set setActiveReplyId", async () => {
  const { getByTestId } = render(<EditComment {...props} />);

  userEvent.click(getByTestId("comment-txt-area"));
  expect(getByTestId("comment-txt-area")).toHaveFocus();
  expect(props.setActiveReplyId).toHaveBeenCalledTimes(1);
  expect(props.setActiveReplyId).toHaveBeenCalledWith("");
});

it("should setComment", () => {
  const { getByTestId } = render(<EditComment {...props} />);

  fireEvent.change(getByTestId("comment-txt-area"), {
    target: { value: "goodbye" },
  });

  expect(props.setComment).toHaveBeenCalledTimes(1);
  expect(props.setComment).toHaveBeenCalledWith("goodbye");
});
