import React from "react";
import PositionModal from ".";
import { shallow } from "enzyme";
import { buildSections } from "tests/utils/createMockQuestionnaire";
import { byName, byTestAttr } from "tests/utils/selectors";

const getItemSelectModal = wrapper =>
  wrapper.find(byTestAttr("position-select-modal"));
const getItemSelect = wrapper => wrapper.find(byName("position"));
const getPositionModalTrigger = wrapper =>
  wrapper.find(byTestAttr("position-modal-trigger"));

describe("PositionModal", () => {
  const options = buildSections(5);

  const createWrapper = (props = {}, render = shallow) =>
    render(
      <PositionModal
        options={options}
        isOpen
        onClose={jest.fn()}
        onMove={jest.fn()}
        selected={options[0]}
        {...props}
      />
    );

  it("should render", () => {
    expect(createWrapper({})).toMatchSnapshot();
  });

  it("should close modal on confirm", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper)
      .first()
      .simulate("click");

    getItemSelectModal(wrapper).simulate("confirm", {
      preventDefault: jest.fn()
    });

    expect(getItemSelectModal(wrapper).prop("isOpen")).toBe(false);
  });

  it("should close modal on cancel", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper)
      .first()
      .simulate("click");

    getItemSelectModal(wrapper).simulate("close");

    expect(getItemSelectModal(wrapper).prop("isOpen")).toBe(false);
  });

  it("should update selected on change", () => {
    const wrapper = createWrapper();
    const position = String(2);

    getItemSelect(wrapper).simulate("change", { value: position });

    expect(getItemSelect(wrapper).prop("value")).toBe(position);
  });

  it("calls onMove when confirmed", () => {
    const onMove = jest.fn();
    const onClose = jest.fn();
    const options = buildSections(5);
    const position = 2;

    const wrapper = createWrapper({ options, onMove, onClose });

    getItemSelect(wrapper).simulate("change", { value: position });

    getItemSelectModal(wrapper).simulate("confirm", {
      preventDefault: jest.fn()
    });

    expect(getItemSelectModal(wrapper).prop("isOpen")).toBe(false);
    expect(onMove).toHaveBeenCalledWith(position);
  });

  it("resets the position if modal is closed", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper)
      .first()
      .simulate("click");

    getItemSelect(wrapper).simulate("change", { value: 1 });
    expect(getItemSelect(wrapper).prop("value")).toBe("1");

    getItemSelectModal(wrapper).simulate("close");
    expect(getItemSelect(wrapper).prop("value")).toBe("0");
  });
});
