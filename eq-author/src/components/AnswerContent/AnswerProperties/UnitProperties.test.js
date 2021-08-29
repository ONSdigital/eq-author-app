import React from "react";
import { shallow } from "enzyme";

import { CENTIMETRES, KILOJOULES } from "constants/unit-types";

import UnitProperties from "./UnitProperties";

const createWrapper = (props = {}, render = shallow) => {
  return render(<UnitProperties {...props} />);
};

describe("Required Property", () => {
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
