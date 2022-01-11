import React from "react";
import { shallow } from "enzyme";

import { TotalValidationEditor } from "./";

describe("TotalValidationEditor", () => {
  let props;
  beforeEach(() => {
    props = {
      total: {
        id: "1",
        enabled: true,
        entityType: "Custom",
        custom: 5,
        previousAnswer: null,
        condition: "LessThan",
        allowUnanswered: true,
      },
      type: "Number",
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
    };
  });

  it("should render", () => {
    expect(shallow(<TotalValidationEditor {...props} />)).toMatchSnapshot();
  });

  it("should trigger change update when the condition is changed", () => {
    const wrapper = shallow(<TotalValidationEditor {...props} />);
    wrapper
      .find("[data-test='total-condition-select']")
      .simulate("change", { name: "condition", value: "MoreThan" });
    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "condition",
      value: "MoreThan",
    });
  });

  it("should trigger change update when the entity type is changed by the pill tabs", () => {
    const wrapper = shallow(<TotalValidationEditor {...props} />);
    wrapper.find("[data-test='total-pill-tabs']").simulate("entityTypeChange", {
      name: "entityType",
      value: "PreviousAnswer",
    });

    expect(props.onChangeUpdate).toHaveBeenCalledWith({
      name: "entityType",
      value: "PreviousAnswer",
    });
  });
});
