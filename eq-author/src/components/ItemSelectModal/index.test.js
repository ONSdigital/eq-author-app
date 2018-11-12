import React from "react";
import ItemSelectModal from ".";
import { shallow } from "enzyme";

describe("ItemSelectModal", () => {
  const createWrapper = (props = {}, render = shallow) =>
    render(
      <ItemSelectModal
        isOpen
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        title="Test title"
        {...props}
      >
        <input />
      </ItemSelectModal>
    );

  it("should render", () => {
    expect(createWrapper()).toMatchSnapshot();
  });

  it("should call onConfirm when submit button is clicked", () => {
    const onConfirm = jest.fn();
    const wrapper = createWrapper({ onConfirm });

    wrapper.find(`form`).simulate("submit");
    expect(onConfirm).toHaveBeenCalled();
  });

  it("should close the modal when cancel button is clicked", () => {
    const onClose = jest.fn();
    const wrapper = createWrapper({ onClose });

    wrapper.find(`[variant="secondary"]`).simulate("click");
    expect(onClose).toHaveBeenCalled();
  });
});
