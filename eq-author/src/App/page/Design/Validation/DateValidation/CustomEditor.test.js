import React from "react";
import { shallow } from "enzyme";

import CustomEditor from "./CustomEditor";

describe("Custom Editor", () => {
  let props, wrapper;
  beforeEach(() => {
    props = {
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      validation: {
        customDate: null,
      },
    };

    wrapper = shallow(<CustomEditor {...props} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should trigger update answer validation when the custom value changes", () => {
    const customDateField = wrapper.first();
    customDateField.simulate("change", "event");
    expect(props.onChange).toHaveBeenCalledWith("event");
    customDateField.simulate("blur", "event");
    expect(props.onUpdate).toHaveBeenCalledWith("event");
  });
});
