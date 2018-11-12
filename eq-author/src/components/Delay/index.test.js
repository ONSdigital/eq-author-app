import React from "react";
import { mount } from "enzyme";
import Delay from ".";

describe("Delay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  describe("before timeout has elapsed", () => {
    it("should display nothing ", () => {
      const wrapper = mount(<Delay>Hello</Delay>);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe("after timeout has elapsed", () => {
    it("should render children", () => {
      const wrapper = mount(<Delay>Hello</Delay>);

      jest.runTimersToTime(Delay.defaultProps.delay);
      wrapper.update();

      expect(wrapper).toMatchSnapshot();
    });
  });
});
