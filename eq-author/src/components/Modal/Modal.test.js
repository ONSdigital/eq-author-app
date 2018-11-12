import React from "react";
import { shallow, mount } from "enzyme";
import Modal, { CloseButton } from "components/Modal";

const createWrapper = (props = {}, render = shallow, children = undefined) => {
  return render(<Modal {...props}>{children}</Modal>);
};

describe("components/Modal", () => {
  let props;
  let wrapper;
  let children;

  beforeEach(() => {
    props = {
      title: "Modal title",
      alias: "Subheading",
      description: "Description",
      onClose: jest.fn(),
      icon: "move",
      isOpen: true
    };

    children = <p>Modal content</p>;

    wrapper = createWrapper(props, shallow, children);
  });

  it("should render its children", () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe("closing the modal", () => {
    it("should handle close on request to close the modal", () => {
      wrapper.find("Modal__StyledModal").simulate("requestClose");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should close if overlay is clicked", () => {
      wrapper = createWrapper(props, mount, children);
      wrapper.find(".Overlay").simulate("click");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should close if ESC key is pressed", () => {
      wrapper = createWrapper(props, mount, children);
      wrapper.find(".Modal").simulate("keyDown", { keyCode: 27 });
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should not close if any other key is pressed", () => {
      wrapper = createWrapper(props, mount, children);
      wrapper.find(".Modal").simulate("keyDown", { keyCode: 28 });
      expect(props.onClose).not.toHaveBeenCalled();
    });

    it("should close when the close button is clicked", () => {
      wrapper = createWrapper(props, shallow, children);
      wrapper.find(CloseButton).simulate("click");
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should close if browser URL changes", () => {
      document.dispatchEvent(new HashChangeEvent("hashchange"));
      expect(props.onClose).toHaveBeenCalled();
    });

    it("should stop listening for URL changes when unmounted", () => {
      wrapper.unmount();
      document.dispatchEvent(new HashChangeEvent("hashchange"));
      expect(props.onClose).toHaveBeenCalledTimes(0);
    });
  });
});
