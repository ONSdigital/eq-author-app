import React from "react";
import { shallow } from "enzyme";

import NoSkipConditions from "./NoSkipConditions";

describe("components/NoSkipConditions", () => {
  it("should render", () => {
    const wrapper = shallow(
      <NoSkipConditions onAddSkipCondtions={jest.fn()} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onAddSkipConditions when button clicked", () => {
    const onAddSkipCondtions = jest.fn();
    const wrapper = shallow(
      <NoSkipConditions onAddSkipCondtions={onAddSkipCondtions} title="Test">
        Ullamcorper Venenatis Fringilla
      </NoSkipConditions>
    );
    wrapper.find("[data-test='btn-add-skip-condition']").simulate("click");
    expect(onAddSkipCondtions).toHaveBeenCalled();
  });
});
