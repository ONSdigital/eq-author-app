import React from "react";
import { shallow, mount } from "enzyme";

import Modal, { CloseButton } from "./";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

describe("components/Modal", () => {
  jest.useFakeTimers();
  let props;

  beforeEach(() => {
    props = {
      title: "Modal title",
      alias: "Subheading",
      description: "Description",
      onClose: jest.fn(),
      icon: "move",
      isOpen: true,
      children: <p>Modal content</p>,
      history: jest.fn(),
    };
  });

  it("should render its children", () => {
    const wrapper = shallow(<Modal {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  describe("opening the modal", () => {
    it("should not render the react-modal until it is open", () => {
      const wrapper = shallow(<Modal {...props} isOpen={false} />);
      expect(wrapper.find("Modal__StyledModal").exists()).toBe(false);
    });

    it("should render the react modal when opened", () => {
      const history = createMemoryHistory();
      const wrapper = mount(
        <Router history={history}>
          <Modal {...props} isOpen />
        </Router>
      );
      expect(wrapper.find("Modal__StyledModal").exists()).toBe(true);
    });
  });

  describe("closing the modal", () => {
    it("should handle close on request to close the Modals", () => {
      const wrapper = shallow(<Modal {...props} />);
      wrapper.find("Modal__StyledModal").simulate("requestClose");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should close if overlay is clicked", () => {
      const history = createMemoryHistory();
      const wrapper = mount(
        <Router history={history}>
          <Modal {...props} isOpen />
        </Router>
      );
      wrapper.find(".Overlay").simulate("click");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should close if ESC key is pressed", () => {
      const history = createMemoryHistory();
      const wrapper = mount(
        <Router history={history}>
          <Modal {...props} isOpen />
        </Router>
      );
      wrapper.find(".Modal").simulate("keyDown", { keyCode: 27 });
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should not close if any other key is pressed", () => {
      const history = createMemoryHistory();
      const wrapper = mount(
        <Router history={history}>
          <Modal {...props} isOpen />
        </Router>
      );
      wrapper.find(".Modal").simulate("keyDown", { keyCode: 28 });
      expect(props.onClose).not.toHaveBeenCalled();
    });

    it("should close when the close button is clicked", () => {
      const wrapper = shallow(<Modal {...props} />);
      wrapper.find(CloseButton).simulate("click");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should close if browser URL changes", () => {
      shallow(<Modal {...props} />);
      document.dispatchEvent(new HashChangeEvent("hashchange"));
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should stop listening for URL changes when unmounted", () => {
      const wrapper = shallow(<Modal {...props} />);
      wrapper.unmount();
      document.dispatchEvent(new HashChangeEvent("hashchange"));
      expect(props.onClose).toHaveBeenCalledTimes(0);
    });

    it("should not hide the react modal until after the animation timeout", () => {
      const history = createMemoryHistory();
      const wrapper = (isOpen) =>
        mount(
          <Router history={history}>
            <Modal {...props} isOpen={isOpen} />
          </Router>
        );
      expect(wrapper(true).text()).toContain("Modal content");
      jest.runAllTimers();
      expect(wrapper(false).text()).toBe("");
    });

    it("should not error if it is unmounted whilst animating out", () => {
      const history = createMemoryHistory();
      const wrapper = mount(
        <Router history={history}>
          <Modal {...props} isOpen />
        </Router>
      );
      wrapper.setProps({ isOpen: false });
      wrapper.unmount();
      expect(() => {
        jest.runAllTimers();
      }).not.toThrow();
    });
  });
});
