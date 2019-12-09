import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";

describe("DeleteConfirmDialog", () => {
  let mockMutations;
  let page;

  beforeEach(() => {
    mockMutations = {
      onDelete: jest.fn(),
      onClose: jest.fn(),
    };

    page = {
      __typename: "Page",
      id: "1",
      title: "",
      description: "",
      guidance: "",
    };
  });

  it("should render", () => {
    const { getByText } = render(
      <DeleteConfirmDialog
        {...mockMutations}
        page={page}
        isOpen
        alertText="I am an alert"
        icon={"icon.svg"}
      />
    );
    expect(getByText("I am an alert")).toBeTruthy();
  });

  it("should call deletePage handler when delete button is clicked", () => {
    const { getByTestId } = render(
      <DeleteConfirmDialog
        {...mockMutations}
        page={page}
        isOpen
        alertText="I am an alert"
        icon={"icon.svg"}
      />
    );
    const deleteBtn = getByTestId("btn-delete-modal");
    fireEvent.click(deleteBtn);
    expect(mockMutations.onDelete).toHaveBeenCalled();
  });

  it("should call close handler when cancel button is clicked", () => {
    const { getByTestId } = render(
      <DeleteConfirmDialog
        {...mockMutations}
        page={page}
        isOpen
        alertText="I am an alert"
        icon={"icon.svg"}
      />
    );
    const deleteBtn = getByTestId("btn-cancel-modal");
    fireEvent.click(deleteBtn);
    expect(mockMutations.onClose).toHaveBeenCalled();
  });
});
