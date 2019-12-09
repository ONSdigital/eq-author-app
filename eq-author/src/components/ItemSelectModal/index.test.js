import React from "react";
import ItemSelectModal from "components/ItemSelectModal";
import { render, fireEvent } from "tests/utils/rtl";

describe("ItemSelectModal", () => {
  let props;

  beforeEach(() => {
    props = { isOpen: true, onClose: jest.fn(), onConfirm: jest.fn() };
  });

  const renderComponent = (props = {}) =>
    render(
      <ItemSelectModal title="Test title" {...props}>
        <input />
      </ItemSelectModal>
    );

  it("should render", () => {
    expect(renderComponent(props).getByText("Test title")).toBeTruthy();
  });

  it("should call onConfirm when submit button is clicked", () => {
    const { getByText } = renderComponent(props);
    fireEvent.submit(getByText("Select"));
    expect(props.onConfirm).toHaveBeenCalled();
  });

  it("should close the Modals when cancel button is clicked", () => {
    const { getByText } = renderComponent(props);

    fireEvent.click(getByText("Cancel"));
    expect(props.onClose).toHaveBeenCalled();
  });
});
