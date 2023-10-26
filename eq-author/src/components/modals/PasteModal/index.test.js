import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import PasteModal from ".";

import { keyCodes } from "constants/keyCodes";

const { Escape } = keyCodes;

describe("PasteModal", () => {
  let onConfirm, onCancel;
  onConfirm = jest.fn();
  onCancel = jest.fn();
  const renderModal = (props) =>
    render(
      <PasteModal isOpen onConfirm={onConfirm} onCancel={onCancel} {...props} />
    );

  it("should close modal when cancel button is clicked", () => {
    const { getByTestId } = renderModal();
    const cancelButton = getByTestId("paste-modal-cancel");
    fireEvent.click(cancelButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should close modal when confirm button is clicked", () => {
    const { getByTestId } = renderModal();
    const confirmButton = getByTestId("paste-modal-confirm");
    fireEvent.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});

describe("PasteModalEscape", () => {
  let onConfirm, onCancel;
  onConfirm = jest.fn();
  onCancel = jest.fn();
  const renderModal = (props) =>
    render(
      <PasteModal isOpen onConfirm={onConfirm} onCancel={onCancel} {...props} />
    );

  it("should close modal when escape key is pressed", () => {
    const { getByTestId } = renderModal();
    fireEvent.keyDown(getByTestId("paste-modal"), {
      key: Escape,
      code: Escape,
    });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
