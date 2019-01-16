import React from "react";
import { shallow } from "enzyme";

import withChangeUpdate from "./withChangeUpdate";

const EnhancedComponent = withChangeUpdate("div");

const createWrapper = (props, render = shallow) =>
  render(<EnhancedComponent {...props} />);

describe("withChangeUpdate", () => {
  let props, wrapper;
  let onChange = jest.fn();
  let onUpdate = jest.fn();

  beforeEach(() => {
    props = {
      onChange: onChange,
      onUpdate: onUpdate,
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should correctly handle change update", () => {
    const update = { foo: "bar" };
    wrapper.simulate("changeUpdate", update);
    expect(onChange).toHaveBeenCalledWith(update, onUpdate);
  });
});
