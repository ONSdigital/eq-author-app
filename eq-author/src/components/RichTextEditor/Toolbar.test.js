import React from "react";
import Toolbar from "components/RichTextEditor/Toolbar";
import ToolbarButton from "components/RichTextEditor/ToolbarButton";
import LinkButton from "./LinkPlugin/ToolbarButton";
import PipingMenu from "components/RichTextEditor/PipingMenu";
import { shallow } from "enzyme";

let wrapper, props, buttons;

const shape = expect.objectContaining({
  id: expect.any(String),
  title: expect.any(String),
  icon: expect.any(Function),
  type: expect.any(String),
  style: expect.any(String),
});

describe("components/RichTextEditor/Toolbar", () => {
  beforeEach(() => {
    props = {
      onToggle: jest.fn(),
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      onPiping: jest.fn(),
      isActiveControl: jest.fn(),
      selectionIsCollapsed: true,
      onLinkChosen: jest.fn(),
    };
    wrapper = shallow(<Toolbar {...props} visible />);
    buttons = wrapper.find(ToolbarButton);
  });

  it("should render", () => {
    expect(buttons.length).toBeGreaterThan(0);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Buttons as disabled according to props provided", () => {
    const controls = {
      bold: false,
      emphasis: false,
      list: false,
      heading: false,
    };
    wrapper = shallow(<Toolbar {...props} controls={controls} visible />);
    wrapper.find(ToolbarButton).forEach((node) => {
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
    buttons.forEach((node) => {
      node.simulate("click");

      expect(props.onToggle).toHaveBeenLastCalledWith(shape);
    });
  });

  it("should not call onToggle when, for example, 'ESC' key is pressed when focused on a button", () => {
    buttons.forEach((node) => {
      node.simulate("KeyDown", { key: "ESC" });
      expect(props.onToggle).not.toHaveBeenLastCalledWith(shape);
    });
  });

  describe("Link button", () => {
    beforeEach(() => {
      props = {
        onToggle: jest.fn(),
        onFocus: jest.fn(),
        onBlur: jest.fn(),
        onPiping: jest.fn(),
        isActiveControl: jest.fn(),
        selectionIsCollapsed: true,
        onLinkChosen: jest.fn(),
      };
      wrapper = shallow(<Toolbar {...props} visible />);
    });

    it("should enable link button", () => {
      const controls = {
        link: true,
      };

      wrapper = shallow(<Toolbar {...props} controls={controls} visible />);

      wrapper.find(LinkButton).forEach((node) => {
        expect(node.props().disabled).toBe(false);
      });
    });

    it("should disable link button when link is false", () => {
      const controls = {
        link: false,
      };

      wrapper = shallow(<Toolbar {...props} controls={controls} visible />);

      wrapper.find(LinkButton).forEach((node) => {
        expect(node.props().disabled).toBe(true);
      });
    });

    it("should disable link button when linkCount is greater than linkLimit", () => {
      const controls = {
        link: true,
      };

      const linkCount = 2;
      const linkLimit = 1;

      wrapper = shallow(
        <Toolbar
          {...props}
          controls={controls}
          linkCount={linkCount}
          linkLimit={linkLimit}
          visible
        />
      );

      wrapper.find(LinkButton).forEach((node) => {
        expect(node.props().disabled).toBe(true);
      });
    });

    it("should disable link button when linkCount is equal to linkLimit", () => {
      const controls = {
        link: true,
      };

      const linkCount = 1;
      const linkLimit = 1;

      wrapper = shallow(
        <Toolbar
          {...props}
          controls={controls}
          linkCount={linkCount}
          linkLimit={linkLimit}
          visible
        />
      );

      wrapper.find(LinkButton).forEach((node) => {
        expect(node.props().disabled).toBe(true);
      });
    });

    it("should enable link button when linkCount is less than linkLimit", () => {
      const controls = {
        link: true,
      };

      const linkCount = 1;
      const linkLimit = 2;

      wrapper = shallow(
        <Toolbar
          {...props}
          controls={controls}
          linkCount={linkCount}
          linkLimit={linkLimit}
          visible
        />
      );

      wrapper.find(LinkButton).forEach((node) => {
        expect(node.props().disabled).toBe(false);
      });
    });
  });
});
