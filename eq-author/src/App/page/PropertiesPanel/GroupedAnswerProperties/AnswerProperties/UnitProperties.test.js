import React from "react";
import { shallow } from "enzyme";

import { CENTIMETRES, KILOJOULES } from "constants/unit-types";

import UnitProperties from "./Properties/UnitProperties";

const createWrapper = (props = {}, render = shallow) => {
  return render(<UnitProperties {...props} />);
};

describe("With preset property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      unit: CENTIMETRES,
      onChange: jest.fn(),
    };
    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change event for input", () => {
    wrapper.simulate("change", { target: { unit: KILOJOULES } });
    expect(props.onChange).toHaveBeenCalledWith({
      target: { unit: KILOJOULES },
    });
  });
});

describe("Without preset property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      unit: "",
      onChange: jest.fn(),
    };
    wrapper = createWrapper(props, shallow);
  });

  it("should show Select a type before property selected", () => {
    expect(wrapper.find("Select a type")).toBeTruthy();
  });
});
