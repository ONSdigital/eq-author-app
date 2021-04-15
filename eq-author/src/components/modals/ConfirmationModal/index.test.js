import React from "react";

import { screen, render } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import ConfirmationModal, {
  DEFAULT_CANCEL_TEXT,
  DEFAULT_CONFIRM_TEXT,
} from ".";

describe("Confirmation modal", () => {
  it("should invoke onConfirm when confirm button pushed", () => {
    const onConfirm = jest.fn();
    render(
      <ConfirmationModal isOpen onCancel={jest.fn()} onConfirm={onConfirm} />
    );
    userEvent.click(screen.getByText(DEFAULT_CONFIRM_TEXT));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should invoke onCancel when cancel button pushed", () => {
    const onCancel = jest.fn();
    render(
      <ConfirmationModal isOpen onCancel={onCancel} onConfirm={jest.fn()} />
    );
    userEvent.click(screen.getByText(DEFAULT_CANCEL_TEXT));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should be hidden by default", () => {
    render(<ConfirmationModal onCancel={jest.fn()} onConfirm={jest.fn()} />);
    expect(screen.queryByText(DEFAULT_CANCEL_TEXT)).toBeNull();
  });
});
