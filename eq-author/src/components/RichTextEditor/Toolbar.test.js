import React from "react";
import Toolbar from "components/RichTextEditor/Toolbar";
import ToolbarButton from "components/RichTextEditor/ToolbarButton";
import PipingMenu from "./PipingMenu";
import { shallow } from "enzyme";

let wrapper, props, buttons;

const shape = expect.objectContaining({
  id: expect.any(String),
  title: expect.any(String),
  icon: expect.any(Function),
  type: expect.any(String),
  style: expect.any(String)
});

describe("components/RichTextEditor/Toolbar", () => {
  beforeEach(() => {
    props = {
      onToggle: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      onPiping: jest.fn(),
      isActiveControl: jest.fn(),
      selectionIsCollapsed: true
    };
    wrapper = shallow(<Toolbar {...props} visible />);
    buttons = wrapper.find(ToolbarButton);
  });

  it("should render as hidden by default", () => {
    wrapper = shallow(<Toolbar {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(ToolbarButton).length).toBe(0);
  });

  it("should render as visible", () => {
    expect(buttons.length).toBeGreaterThan(0);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Buttons as disabled according to props provided", () => {
    const controls = {
      bold: false,
      emphasis: false,
      list: false,
      heading: false
    };
    wrapper = shallow(<Toolbar {...props} controls={controls} visible />);
    wrapper.find(ToolbarButton).forEach(node => {
      expect(node.props().disabled).toBe(true);
    });
  });

  describe("PipingMenu", () => {
    it("should disable PipingMenu if selection is not collapsed", () => {
      wrapper = shallow(
        <Toolbar
          {...props}
          visible
          controls={{ piping: true }}
          selectionIsCollapsed={false}
        />
      );
      expect(wrapper.find(PipingMenu).prop("disabled")).toBe(true);
    });

    it("should enable PipingMenu if selection is collapsed", () => {
      wrapper = shallow(
        <Toolbar
          {...props}
          visible
          controls={{ piping: true }}
          selectionIsCollapsed
        />
      );

      expect(wrapper.find(PipingMenu).prop("disabled")).toBe(false);
    });
  });

  it("should call onToggle when clicked with appropriate button object", () => {
    buttons.forEach(node => {
      node.simulate("click");

      expect(props.onToggle).toHaveBeenLastCalledWith(shape);
    });
  });

  it("should not call onToggle when, for example, 'ESC' key is pressed when focused on a button", () => {
    buttons.forEach(node => {
      node.simulate("KeyDown", { key: "ESC" });
      expect(props.onToggle).not.toHaveBeenLastCalledWith(shape);
    });
  });
});
