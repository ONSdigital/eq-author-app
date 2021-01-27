import React from "react";
import { shallow, mount } from "enzyme";

import CustomEditor from "./CustomEditor";
import ValidationError from "components/ValidationError";

describe("Custom Editor", () => {
  let props;
  beforeEach(() => {
    props = {
      total: {
        id: "1",
        custom: 5,
      },
      errors: [
        {
          errorCode: "ERR_NO_VALUE",
          field: "totalValidation",
          id: "pages-1-totalValidation",
          type: "pages",
        },
      ],
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

  it("should display validation message when error present", () => {
    const wrapper = shallow(<CustomEditor {...props} />).find(ValidationError);
    expect(wrapper.find(ValidationError)).toHaveLength(1);
  });

  it("should display error styling when error present", () => {
    const wrapper = mount(<CustomEditor {...props} />).find(
      "CustomEditor__LargerNumber"
    );

    expect(wrapper).toHaveStyleRule("border-radius: 4px;");
  });
});
