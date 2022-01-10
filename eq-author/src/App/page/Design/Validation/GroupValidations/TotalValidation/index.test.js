import React from "react";
import { shallow } from "enzyme";

import { TotalValidation } from "./";

import ValidationView from "../../ValidationView";

describe("Total Validation", () => {
  let props;
  beforeEach(() => {
    props = {
      onToggleValidationRule: jest.fn(),
      type: "Percentage",
      total: {
        id: "1",
        enabled: true,
        entityType: "Custom",
        custom: 5,
        previousAnswer: null,
        condition: "Equal",
        allowUnanswered: true,
      },
    };
  });

  it("should render", () => {
    const wrapper = shallow(<TotalValidation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should toggle the validation rule when ValidationView toggles it", () => {
    const wrapper = shallow(<TotalValidation {...props} />);
    wrapper.find(ValidationView).simulate("toggleChange", { value: false });
    expect(props.onToggleValidationRule).toHaveBeenCalledWith({
      ...props.total,
      enabled: false,
    });
  });

  it("should render the disabled message when disabled", () => {
    props.total.enabled = false;
    const wrapper = shallow(<TotalValidation {...props} />);
    expect(wrapper.find("[data-test='disabled-total']")).toHaveLength(1);
    expect(wrapper.find("[data-test='validation-editor']")).toHaveLength(0);
  });

  it("should render the editor when enabled", () => {
    props.total.enabled = true;
    const wrapper = shallow(<TotalValidation {...props} />);
    expect(wrapper.find("[data-test='disabled-total']")).toHaveLength(0);
    expect(wrapper.find("[data-test='validation-editor']")).toHaveLength(1);
  });
});
