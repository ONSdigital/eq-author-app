import React from "react";
import { shallow } from "enzyme";

import withCustomNumberValueChange from "./withCustomNumberValueChange";

const EnhancedComponent = withCustomNumberValueChange("div");

const createWrapper = (props, render = shallow) =>
  render(<EnhancedComponent {...props} />);

describe("withCustomValueChange", () => {
  let props, wrapper;
  let onChange = jest.fn();

  beforeEach(() => {
    props = {
      limit: 999999999,
      onChange: onChange,
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly handle range values", () => {
    wrapper.simulate("customNumberValueChange", { value: 1000000000 });
    expect(onChange).not.toHaveBeenCalled();

    wrapper.simulate("customNumberValueChange", { value: -1000000000 });
    expect(onChange).not.toHaveBeenCalled();

    wrapper.simulate("customNumberValueChange", { value: 999999999 });
    expect(onChange).toHaveBeenCalled();

    wrapper.simulate("customNumberValueChange", { value: -999999999 });
    expect(onChange).toHaveBeenCalled();
  });

  it("should correctly handle custom value changes with in range values", () => {
    wrapper.simulate("customNumberValueChange", { value: "1" });
    expect(onChange).toHaveBeenCalledWith({ name: "custom", value: 1 });
  });

  it("should correctly handle value change with empty field", () => {
    wrapper.simulate("customNumberValueChange", { value: null });
    expect(onChange).toHaveBeenCalledWith({ name: "custom", value: null });
  });

  it("should correctly coerce string inputs to integers", () => {
    wrapper.simulate("customNumberValueChange", { value: "1" });
    expect(onChange).toHaveBeenCalledWith({ name: "custom", value: 1 });
  });
});
