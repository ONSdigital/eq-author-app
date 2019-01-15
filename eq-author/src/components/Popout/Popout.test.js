import React from "react";
import { shallow, mount } from "enzyme";
import Popout from "./";

let component, handleToggleOpen, trigger;

describe("components/Popout", () => {
  beforeEach(() => {
    trigger = <button>Click Me</button>;
    handleToggleOpen = jest.fn();

    const Content = () => <h1>hello world</h1>;

    component = (
      <Popout trigger={trigger} open onToggleOpen={handleToggleOpen}>
        <Content />
      </Popout>
    );
  });

  it("shouldn't render content when closed", () => {
    component = React.cloneElement(component, { open: false });
    expect(shallow(component)).toMatchSnapshot();
  });

  it("should render content when open", () => {
    const wrapper = shallow(component);
    expect(wrapper).toMatchSnapshot();
    wrapper.unmount();
  });

  describe("event handlers", () => {
    let mounted;

    beforeEach(() => {
      mounted = mount(component, {
        attachTo: document.body.appendChild(document.createElement("div")),
      });
    });

    describe("when open", () => {
      it("should close when ESC key pressed", () => {
        document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 27 }));
        expect(handleToggleOpen).toHaveBeenCalledWith(false);
      });

      it("should not close when key other than ESC pressed", () => {
        document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 28 }));
        expect(handleToggleOpen).not.toHaveBeenCalled();
      });

      it("should close when clicking outside", () => {
        document.dispatchEvent(new MouseEvent("click"));
        expect(handleToggleOpen).toHaveBeenCalledWith(false);
      });

      it("should not close on mouse events other than click", () => {
        document.dispatchEvent(new MouseEvent("dblclick"));
        document.dispatchEvent(new MouseEvent("mousedown"));
        document.dispatchEvent(new MouseEvent("mouseenter"));
        document.dispatchEvent(new MouseEvent("mouseleave"));
        document.dispatchEvent(new MouseEvent("mousemove"));
        document.dispatchEvent(new MouseEvent("mouseover"));
        document.dispatchEvent(new MouseEvent("mouseout"));
        document.dispatchEvent(new MouseEvent("mouseup"));
        expect(handleToggleOpen).not.toHaveBeenCalled();
      });

      it("should not close when clicking inside", () => {
        document.querySelector("h1").dispatchEvent(new MouseEvent("click"));
        expect(handleToggleOpen).not.toHaveBeenCalled();
      });
    });

    describe("when closed", () => {
      beforeEach(() => {
        mounted.setProps({ open: false });
      });

      it("should open when trigger clicked", () => {
        mounted.find("button").simulate("click");
        expect(handleToggleOpen).toHaveBeenCalledWith(true);
      });

      it("should not listen for ESC key presses", () => {
        document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 27 }));
        expect(handleToggleOpen).not.toHaveBeenCalled();
      });

      it("should close listen for clicks outside", () => {
        document.dispatchEvent(new MouseEvent("click"));
        expect(handleToggleOpen).not.toHaveBeenCalled();
      });

      it("should bind event handlers when state changes to open", () => {
        mounted.setProps({ open: true });

        document.dispatchEvent(new MouseEvent("click"));
        expect(handleToggleOpen).toHaveBeenCalled();
      });
    });

    describe("when unmounted", () => {
      it("should clean up event handlers", () => {
        mounted.unmount();

        document.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 27 }));
        document.dispatchEvent(new MouseEvent("click"));

        expect(handleToggleOpen).not.toHaveBeenCalled();
      });
    });
  });
});
