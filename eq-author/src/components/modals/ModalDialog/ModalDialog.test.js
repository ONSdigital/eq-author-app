import React from "react";
import { shallow } from "enzyme";
import ModalDialog from "./";

const createWrapper = (props, render = shallow) => {
  return render(<ModalDialog {...props} />);
};

describe("ModalDialog", () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      onClose: jest.fn(),
      isOpen: false,
      children: <div>Modal dialog content</div>,
    };

    wrapper = createWrapper(props);
  });

  it("should render when closed", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when open", () => {
    wrapper = createWrapper({
      ...props,
      isOpen: true,
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should call close handler when closed", () => {
    wrapper.simulate("close");
    expect(props.onClose).toHaveBeenCalled();
  });
});
