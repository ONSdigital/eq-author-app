import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import moment from "moment";
import "moment/locale/en-gb";

import Replies from "./Replies";

const props = {
  repliesItem: {
    id: "1",
    commentText: "Reply 1",
    user: {
      id: "userId",
      displayName: "Rob ot",
    },
    editedTime: "2021-01-22T12:54:43.577Z",
  },
  myId: "userId",
  index: 0,
  repliesIndex: 0,
  item: {},
  activeReplyId: "",
  editReply: "",
};

const setup = props => {
  const setReply = jest.fn();
  const setActiveReplyId = jest.fn();
  const handleEditReply = jest.fn();
  const handleDeleteReply = jest.fn();
  const handleSaveEditReply = jest.fn();
  const setEditReply = jest.fn();
  const setReplyRef = jest.fn();
  const getInitials = jest.fn();

  const utils = render(
    <Replies
      {...props}
      setReply={setReply}
      setActiveReplyId={setActiveReplyId}
      handleEditReply={handleEditReply}
      handleDeleteReply={handleDeleteReply}
      handleSaveEditReply={handleSaveEditReply}
      setEditReply={setEditReply}
      setReplyRef={setReplyRef}
      getInitials={getInitials}
    />
  );

  return {
    ...utils,
    setReply,
    setActiveReplyId,
    handleEditReply,
    handleDeleteReply,
    handleSaveEditReply,
    setEditReply,
    setReplyRef,
    getInitials,
  };
};

const defaultSetup = () => {
  const utils = setup(props);
  return { ...utils };
};

const modifiedSetup = changes => {
  const utils = setup({ ...props, ...changes });
  return { ...utils };
};

const editStateSetup = () => {
  const utils = modifiedSetup({ ...props, activeReplyId: "1" });

  const save = utils.getByTestId(
    `btn-save-editedReply-${props.index}-${props.repliesIndex}`
  );
  const cancel = utils.getByTestId(`btn-cancel-reply-${props.index}`);
  const textarea = utils.getByTestId(
    `reply-txtArea-${props.index}-${props.repliesIndex}`
  );

  return { ...utils, save, cancel, textarea };
};

describe("Replies", () => {
  it("should render", () => {
    const { getByText, getByTestId } = defaultSetup();
    expect(getByText(props.repliesItem.commentText)).toBeVisible();
    expect(
      getByTestId(`btn-edit-${props.index}-${props.repliesIndex}`)
    ).toBeVisible();
    expect(
      getByTestId(`btn-delete-${props.index}-${props.repliesIndex}`)
    ).toBeVisible();
  });

  it("should edit a reply", () => {
    const { getByText, getByTestId, handleEditReply } = defaultSetup();

    expect(getByText(props.repliesItem.commentText)).toBeVisible();
    expect(
      getByText(`Edited: ${moment(props.repliesItem.editedTime).calendar()}`)
    ).toBeVisible();

    fireEvent.click(
      getByTestId(`btn-edit-${props.index}-${props.repliesIndex}`)
    );

    expect(handleEditReply).toHaveBeenCalledTimes(1);
    expect(handleEditReply).toHaveBeenCalledWith(props.repliesItem);
  });

  it("should delete a reply", () => {
    const { getByTestId, handleDeleteReply } = defaultSetup();

    fireEvent.click(
      getByTestId(`btn-delete-${props.index}-${props.repliesIndex}`)
    );

    expect(handleDeleteReply).toHaveBeenCalledTimes(1);
    expect(handleDeleteReply).toHaveBeenCalledWith(
      props.item,
      props.repliesItem
    );
  });

  it("should render edit text state", () => {
    const { save, cancel, textarea } = editStateSetup();

    expect(save).toBeVisible();
    expect(cancel).toBeVisible();
    expect(textarea).toBeVisible();
  });

  it("should fire onChange when editing text area", () => {
    const newText = "New reply 1.5";
    const { textarea, setEditReply } = editStateSetup();

    fireEvent.change(textarea, {
      target: { value: newText },
    });

    expect(setEditReply).toHaveBeenCalledTimes(1);
    expect(setEditReply).toHaveBeenCalledWith(newText);
  });

  it("should fire onClick save edit reply", () => {
    const { save, handleSaveEditReply } = editStateSetup();

    fireEvent.click(save);

    expect(handleSaveEditReply).toHaveBeenCalledTimes(1);
    expect(handleSaveEditReply).toHaveBeenCalledWith(
      props.item,
      props.repliesItem
    );
  });

  it("should fire onClick cancel edit reply", () => {
    const { cancel, setReply, setActiveReplyId } = editStateSetup();

    fireEvent.click(cancel);

    expect(setReply).toHaveBeenCalledTimes(1);
    expect(setReply).toHaveBeenCalledWith("");
    expect(setActiveReplyId).toHaveBeenCalledTimes(1);
    expect(setActiveReplyId).toHaveBeenCalledWith("");
  });
});
