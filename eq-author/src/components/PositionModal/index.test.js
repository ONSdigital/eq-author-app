import React from "react";
import PositionModal from "./";
import { shallow } from "enzyme";
import { render, fireEvent } from "tests/utils/rtl";
import { buildSections } from "tests/utils/createMockQuestionnaire";
import { byName, byTestAttr } from "tests/utils/selectors";

const getItemSelectModal = (wrapper) =>
  wrapper.find(byTestAttr("position-select-modal"));
const getItemSelect = (wrapper) => wrapper.find(byName("position"));
const getPositionModalTrigger = (wrapper) =>
  wrapper.find(byTestAttr("position-modal-trigger"));

describe("PositionModal", () => {
  const options = buildSections({ sectionCount: 5 });
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

  it("should open when trigger clicked", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper).first().simulate("click");
    expect(getItemSelectModal(wrapper).prop("isOpen")).toBe(true);
  });

  it("should close Modals on confirm", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper).first().simulate("click");

    getItemSelectModal(wrapper).simulate("confirm", {
      preventDefault: jest.fn(),
    });

    expect(getItemSelectModal(wrapper).prop("isOpen")).toBe(false);
  });

  it("should close Modals on cancel", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper).first().simulate("click");

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
    const position = 2;

    const wrapper = createWrapper({ options, onMove, onClose });

    getItemSelect(wrapper).simulate("change", { value: position });

    getItemSelectModal(wrapper).simulate("confirm", {
      preventDefault: jest.fn(),
    });

    expect(getItemSelectModal(wrapper).prop("isOpen")).toBe(false);
    expect(onMove).toHaveBeenCalledWith({ position, folderId: null });
  });

  it("resets the position if Modals is closed", () => {
    const wrapper = createWrapper();

    getPositionModalTrigger(wrapper).first().simulate("click");

    getItemSelect(wrapper).simulate("change", { value: 1 });
    expect(getItemSelect(wrapper).prop("value")).toBe("1");

    getItemSelectModal(wrapper).simulate("close");
    expect(getItemSelect(wrapper).prop("value")).toBe("0");
  });

  describe("Positioning behaviours", () => {
    let options;
    function openModalState(selected = 0) {
      const wrapper = createWrapper({
        options,
        selected: options[selected],
      });
      getPositionModalTrigger(wrapper).first().simulate("click");
      return wrapper;
    }
    beforeEach(() => {
      options = [
        {
          id: "question-1",
          displayName: "question 1",
          parentEnabled: false,
        },
        {
          id: "Folder-1",
          displayName: "Folder 1",
          __typename: "Folder",
        },
        {
          id: "question-2",
          displayName: "question 2",
          parentEnabled: true,
          parentId: "Folder-1",
        },
        {
          id: "question-3",
          displayName: "question 3",
          parentEnabled: true,
          parentId: "Folder-1",
        },
        {
          id: "question-4",
          displayName: "question 4",
          parentEnabled: false,
        },
        {
          id: "Folder-2",
          displayName: "Folder 2",
          __typename: "Folder",
        },
        {
          id: "question-5",
          displayName: "question 5",
          parentEnabled: true,
          parentId: "Folder-2",
        },
        {
          id: "question-6",
          displayName: "question 6",
          parentEnabled: true,
          parentId: "Folder-2",
        },
      ];
    });

    it("should jump length of folder when clicking on a folder", () => {
      const wrapper = openModalState();
      const value = 1;
      getPositionModalTrigger(wrapper).first().simulate("click");

      getItemSelect(wrapper).simulate("change", { value });

      expect(getItemSelect(wrapper).prop("value")).toBe(
        (
          value + options.filter((item) => item.parentId === "Folder-1").length
        ).toString()
      );
    });

    it("should go into the correct position in folder going down", () => {
      const wrapper = openModalState();
      const value = 2;
      getItemSelect(wrapper).simulate("change", { value });
      expect(getItemSelect(wrapper).prop("value")).toBe(value.toString());
      expect(
        wrapper.find("PositionModal__Indent").getElements()[value].props
          .children
      ).toEqual(options[0].displayName);
      expect(
        wrapper.find("PositionModal__Indent").getElements()[value].props.indent
      ).toBeTruthy();
    });

    it("should go into the correct position in folder going up", () => {
      const selected = 4;
      const wrapper = openModalState(selected);
      const value = 2;
      getItemSelect(wrapper).simulate("change", { value });
      expect(getItemSelect(wrapper).prop("value")).toBe(value.toString());

      expect(
        wrapper.find("PositionModal__Indent").getElements()[value].props
          .children
      ).toEqual(options[selected].displayName);
    });

    it("should go to the correct position when selecting the same value twice", () => {
      const wrapper = openModalState();
      const value = 1;
      getItemSelect(wrapper).simulate("change", { value });

      getItemSelect(wrapper).simulate("change", { value: 0 });

      expect(getItemSelect(wrapper).prop("value")).toBe((0).toString());

      expect(
        wrapper.find("PositionModal__Indent").getElements()[0].props.children
      ).toEqual(options[0].displayName);
    });

    it("should move between folders correctly", () => {
      const initial = 2;
      const wrapper = openModalState(initial);
      const after = 6;
      getItemSelect(wrapper).simulate("change", { value: after });

      expect(getItemSelect(wrapper).prop("value")).toBe(after.toString());

      expect(
        wrapper.find("PositionModal__Indent").getElements()[after].props
          .children
      ).toEqual(options[initial].displayName);
    });

    it("should display the correct styling", () => {
      const { getByText, getByTestId } = createWrapper({ options }, render);
      fireEvent.click(getByText(/Select/));
      expect(getByTestId("option-3")).toHaveStyleRule("margin-left", "1em");
    });
  });
});
