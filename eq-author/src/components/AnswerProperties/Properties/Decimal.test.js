import React from "react";

import Decimal from "components/AnswerProperties/Properties/Decimal";
import { shallow } from "enzyme";

const createWrapper = (props = {}, render = shallow) => {
  return render(<Decimal {...props} />);
};

describe("Decimal Property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      id: "1",
      value: 2,
      onChange: jest.fn()
    };
    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change event for input", () => {
    wrapper.simulate("change", { target: { value: 3 } });
    expect(props.onChange).toHaveBeenCalledWith({ target: { value: 3 } });
  });
});
