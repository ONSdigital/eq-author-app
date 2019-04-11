import React from "react";
import { shallow } from "enzyme";

import NoRouting from "./NoRouting";

describe("components/NoRouting", () => {
  it("should render", () => {
    const wrapper = shallow(
      <NoRouting onAddRouting={jest.fn()} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onAddRouting when button clicked", () => {
    const onAddRouting = jest.fn();
    const wrapper = shallow(
      <NoRouting onAddRouting={onAddRouting} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoRouting>
    );
    wrapper.find("[data-test='btn-add-routing']").simulate("click");
    expect(onAddRouting).toHaveBeenCalled();
  });
});
