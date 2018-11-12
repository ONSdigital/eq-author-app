import React from "react";
import ButtonGroup from "./index";
import { mount } from "enzyme";

describe("button group component", () => {
  describe("snapshot", () => {
    it("Should not have changed inadvertently", () => {
      const wrapper = mount(<ButtonGroup />);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("orientation", () => {
    it("is vertical by default", () => {
      const wrapper = mount(<ButtonGroup vertical />);
      expect(wrapper.props().vertical).toBe(true);
    });
    it("can be horizontal", () => {
      const wrapper = mount(<ButtonGroup horizontal />);
      expect(wrapper.props().horizontal).toBe(true);
    });
  });
});
