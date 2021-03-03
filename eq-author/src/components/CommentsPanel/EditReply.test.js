import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import EditReply from "./EditReply";

const props = {
  replyCount: 0,
  item: {
    id: "1",
    commentText: "Comment number 2",
  },
  reply: "Hello world!",
  index: 0,
};

const setup = (props) => {
  const setReplyRef = jest.fn();
  const setReply = jest.fn();
  const handleSaveReply = jest.fn();
  const setActiveReplyId = jest.fn();

  const utils = render(
    <EditReply
      {...props}
      setReplyRef={setReplyRef}
      setReply={setReply}
      handleSaveReply={handleSaveReply}
      setActiveReplyId={setActiveReplyId}
    />
  );

  return {
    ...utils,
    setReplyRef,
    setReply,
    handleSaveReply,
    setActiveReplyId,
  };
};

const defaultSetup = () => {
  const utils = setup(props);

  return {
    ...utils,
  };
};

describe("EditReply", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();

    expect(getByTestId(`reply-txtArea-${props.index}`)).toBeVisible();
    expect(getByTestId(`btn-save-reply-${props.index}`)).toBeVisible();
    expect(getByTestId(`btn-cancel-reply-${props.index}`)).toBeVisible();
  });

  it("should change text on type", () => {
    const goodbye = "Goodbye world!";
    const { getByTestId, getByText, setReply } = defaultSetup();

    expect(getByText(props.reply)).toBeVisible();

    fireEvent.change(getByTestId(`reply-txtArea-${props.index}`), {
      target: { value: goodbye },
    });

    expect(setReply).toHaveBeenCalledTimes(1);
    expect(setReply).toHaveBeenCalledWith(goodbye);
  });

  it("should handle save reply", () => {
    const { getByTestId, handleSaveReply } = defaultSetup();

    fireEvent.click(getByTestId(`btn-save-reply-${props.index}`));

    expect(handleSaveReply).toHaveBeenCalledTimes(1);
    expect(handleSaveReply).toHaveBeenCalledWith({
      id: "1",
      commentText: "Comment number 2",
    });
  });

  it("should handle cancel reply", () => {
    const { getByTestId, setReply, setActiveReplyId } = defaultSetup();

    fireEvent.click(getByTestId(`btn-cancel-reply-${props.index}`));

    expect(setReply).toHaveBeenCalledTimes(1);
    expect(setReply).toHaveBeenCalledWith("");
    expect(setActiveReplyId).toHaveBeenCalledTimes(1);
    expect(setActiveReplyId).toHaveBeenCalledWith("");
  });
});
