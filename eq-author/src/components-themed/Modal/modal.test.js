import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import Modal from ".";

import { keyCodes } from "constants/keyCodes";

const { Escape } = keyCodes;

describe("Modal", () => {
  let onConfirm, onClose;
  onConfirm = jest.fn();
  onClose = jest.fn();
  const renderModal = (props) =>
    render(
      <Modal
        title="Test title"
        isOpen
        onConfirm={onConfirm}
        onClose={onClose}
        {...props}
      />
    );

  it("should close modal when escape key is pressed", () => {
    const { getByTestId } = renderModal();
    fireEvent.keyDown(getByTestId("modal"), {
      key: Escape,
      code: Escape,
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
