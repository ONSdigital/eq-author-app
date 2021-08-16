import React from "react";
import { shallow } from "enzyme";

import { YEARSMONTHS, YEARS } from "constants/duration-types";

import DurationProperties from "./DurationProperties";

const createWrapper = (props = {}, render = shallow) => {
  return render(<DurationProperties {...props} />);
};

describe("Required Property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      unit: YEARSMONTHS,
      onChange: jest.fn(),
    };
    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change event for input", () => {
    wrapper.simulate("change", { target: { unit: YEARS } });
    expect(props.onChange).toHaveBeenCalledWith({
      target: { unit: YEARS },
    });
  });
});
