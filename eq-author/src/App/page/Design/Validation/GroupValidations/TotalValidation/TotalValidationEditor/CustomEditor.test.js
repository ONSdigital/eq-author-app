import React from "react";
import { shallow } from "enzyme";

import CustomEditor from "./CustomEditor";

describe("Custom Editor", () => {
  let props;
  beforeEach(() => {
    props = {
      total: {
        id: "1",
        custom: 5,
      },
      type: "Currency",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<CustomEditor {...props} />)).toMatchSnapshot();
  });

  it("should trigger onChange when the number input changes", () => {
    const wrapper = shallow(<CustomEditor {...props} />);
    wrapper
      .find("[data-test='total-validation-number-input']")
      .simulate("change", { name: "custom", value: 10 });
    expect(props.onChange).toHaveBeenCalledWith({ name: "custom", value: 10 });
  });

  it("should trigger onUpdate when the number input is blurred", () => {
    const wrapper = shallow(<CustomEditor {...props} />);
    wrapper
      .find("[data-test='total-validation-number-input']")
      .simulate("blur");
    expect(props.onUpdate).toHaveBeenCalled();
  });
});
