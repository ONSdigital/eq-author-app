import React from "react";
import { shallow } from "enzyme";
import { UnconnectedModalWithNav } from "components/ModalWithNav";
import { NAV_ITEMS } from "./ModalWithNav.story";

describe("ModalWithNav", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      id: "TEST_MODAL",
      title: "I am a title",
      onClose: jest.fn(),
      gotoTab: jest.fn(),
      navItems: NAV_ITEMS
    };
  });

  it("should render a list of items", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render an open modal", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} isOpen />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should close when close is pressed in tabs", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} />);
    wrapper.find("Tabs").simulate("close");
    expect(props.onClose).toHaveBeenCalled();
  });

  it("should call gotoTab with the id of the tab and the new id when changed", () => {
    wrapper = shallow(<UnconnectedModalWithNav {...props} />);
    wrapper.find("Tabs").simulate("change", 1);
    expect(props.gotoTab).toHaveBeenCalledWith(props.id, 1);
  });
});
