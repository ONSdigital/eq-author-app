import React from "react";
import { shallow } from "enzyme";
import { byTestAttr } from "tests/utils/selectors";

import PositionPicker from "./PositionPicker";

describe("Date Position Picker", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      value: "before",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };

    wrapper = shallow(<PositionPicker {...props} />);
  });

  it("Should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should trigger update answer validation when the relative position changes", () => {
    const relativePositionField = wrapper.find(
      byTestAttr("relative-position-select")
    );
    relativePositionField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    relativePositionField.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });
});
