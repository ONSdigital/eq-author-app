import React from "react";
import { shallow } from "enzyme";
import Tabs from "./";

describe("Modal Content", () => {
  describe("Tabs", () => {
    const props = {
      activeTabId: "1",
      onChange: jest.fn(),
      onClose: jest.fn(),
      title: "Example title",
      navItems: [
        { id: "1", title: "hello", render: () => <div /> },
        { id: "2", title: "world", render: () => <div /> }
      ]
    };

    it("should render", () => {
      const wrapper = shallow(<Tabs {...props} />);
      expect(wrapper).toMatchSnapshot();
    });

    it("should render items with a title and showing whether it is selected", () => {
      const wrapper = shallow(<Tabs {...props} />);
      const { buttonRender } = wrapper.find("BaseTabs").props();
      const result = shallow(
        buttonRender(
          { "aria-selected": true },
          { title: "foo", isSelected: true }
        )
      );
      expect(result).toMatchSnapshot();
    });
  });
});
