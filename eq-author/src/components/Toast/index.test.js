import React from "react";
import { shallow } from "enzyme";
import Toast from "./index";

jest.useFakeTimers();

describe("Toast", () => {
  const render = (props = {}, children = <span>hello</span>) =>
    shallow(
      <Toast id="1" {...props}>
        {children}
      </Toast>
    );

  it("should render", () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it("should enforce a single child policy", () => {
    expect(() => {
      render({}, "hello world");
    }).toThrow();
  });

  it("should propagate onClose props to child", () => {
    const handleClose = jest.fn();
    const wrapper = render({ onClose: handleClose });
    wrapper.find("span").simulate("close");

    expect(handleClose).toHaveBeenCalled();
  });

  describe("auto-dismiss", () => {
    let wrapper, handleClose;
    const TIMEOUT = 1000;

    beforeEach(() => {
      handleClose = jest.fn();

      wrapper = render({
        timeout: TIMEOUT,
        onClose: handleClose
      });
    });

    it("should start timer if timeout supplied", () => {
      jest.runTimersToTime(TIMEOUT);
      expect(handleClose).toHaveBeenCalled();
    });

    it("should pass id to onClose handler", () => {
      jest.runTimersToTime(TIMEOUT);
      expect(handleClose).toHaveBeenCalledWith("1");
    });

    it("should pause on mouse enter", () => {
      wrapper.simulate("mouseEnter");
      jest.runTimersToTime(TIMEOUT);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it("should resume on mouse leave", () => {
      wrapper.simulate("mouseEnter");
      jest.runTimersToTime(TIMEOUT);

      wrapper.simulate("mouseLeave");
      jest.runTimersToTime(TIMEOUT);

      expect(handleClose).toHaveBeenCalled();
    });

    it("should pause on focus", () => {
      wrapper.simulate("focus");
      jest.runTimersToTime(TIMEOUT);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it("should resume on blur", () => {
      wrapper.simulate("focus");
      jest.runTimersToTime(TIMEOUT);

      wrapper.simulate("blur");
      jest.runTimersToTime(TIMEOUT);

      expect(handleClose).toHaveBeenCalled();
    });
  });
});
