import React from "react";

import Required from "components/AnswerProperties/Properties/Required";
import { shallow } from "enzyme";

const createWrapper = (props = {}, render = shallow) => {
  return render(<Required {...props} />);
};

describe("Required Property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      id: "1",
      value: true,
      onChange: jest.fn()
    };
    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change event for input", () => {
    wrapper.simulate("change", { target: { value: false } });
    expect(props.onChange).toHaveBeenCalledWith({
      target: { value: false }
    });
  });
});
