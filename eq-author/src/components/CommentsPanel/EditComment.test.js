import React from "react";
import { render } from "tests/utils/rtl";
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
