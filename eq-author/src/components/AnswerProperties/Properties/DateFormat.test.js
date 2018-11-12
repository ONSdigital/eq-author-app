import React from "react";

import DateFormat from "components/AnswerProperties/Properties/DateFormat";
import { shallow, mount } from "enzyme";
import { Select } from "components/Forms";

const createWrapper = (props = {}, render = shallow) => {
  return render(<DateFormat {...props} />);
};

describe("DateFormat Property", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      id: "1",
      value: "dd/mm/yyyy",
      onChange: jest.fn()
    };
  });

  it("should render", () => {
    wrapper = createWrapper(props, shallow);
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change event for input", () => {
    wrapper = createWrapper(props, mount);
    wrapper.find(Select).simulate("change", { target: { value: "mm/yy" } });

    expect(props.onChange).toHaveBeenCalledWith({
      name: "1",
      value: "mm/yy"
    });
  });
});
