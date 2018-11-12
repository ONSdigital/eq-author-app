import React from "react";
import { shallow } from "enzyme";
import ToastList from "./ToastList";
import Transition from "./Transition";

describe("ToastList", () => {
  const render = (props = {}) =>
    shallow(
      <ToastList {...props}>
        <p>hello</p>
        <p>world</p>
      </ToastList>
    );

  it("should render", () => {
    const wrapper = render();
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow configurable transitions", () => {
    const wrapper = render({ transition: Transition });
    expect(wrapper).toMatchSnapshot();
  });
});
