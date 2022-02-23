import React from "react";
import { shallow } from "enzyme";

import SecondaryConditionSelector, {
  Selector,
  StyledNumber,
} from "./SecondaryConditionSelector";

describe("secondaryConditionSelector", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      expression: {
        id: "1",
        left: {
          id: "2",
          type: "Checkbox",
        },
        right: null,
        validationErrorInfo: {
          totalCount: 0,
          id: "Num-thing",
          errors: [],
        },
      },
      onRightChange: jest.fn(),
      onConditionChange: jest.fn(),
    };
  });
  it("should render", () => {
    const wrapper = shallow(<SecondaryConditionSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  //SecondaryConditionSelector works in conjunction with expression.condition of "CountOf"
  // so BOTH object are passed onChange
  it("should call the correct handlers when the secondaryCondition is changed", () => {
    const wrapper = shallow(<SecondaryConditionSelector {...defaultProps} />);

    wrapper.find(Selector).simulate("change", { value: "NotEqual" });
    expect(defaultProps.onConditionChange).toHaveBeenCalledWith(
      "CountOf",
      "NotEqual"
    );
  });

  it("should call the correct handler when value is changed", () => {
    const wrapper = shallow(<SecondaryConditionSelector {...defaultProps} />);

    wrapper.find(StyledNumber).simulate("change", { value: 123 });
    wrapper.find(StyledNumber).simulate("blur");
    expect(defaultProps.onRightChange).toHaveBeenCalledWith({
      customValue: { number: 123 },
    });
  });
});
