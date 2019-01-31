import React from "react";
import { shallow } from "enzyme";

import { Number } from "components/Forms";

import NumberAnswerSelector, {
  ConditionSelector,
} from "./NumberAnswerSelector";

import { CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";

describe("NumberAnswerSelector", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      expression: {
        id: "1",
        left: {
          id: "2",
          type: NUMBER,
        },
        right: null,
      },
      onRightChange: jest.fn(),
      onConditionChange: jest.fn(),
    };
  });
  it("should render", () => {
    const wrapper = shallow(<NumberAnswerSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a currency", () => {
    defaultProps.expression.left.type = CURRENCY;
    const wrapper = shallow(<NumberAnswerSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a percentage", () => {
    defaultProps.expression.left.type = PERCENTAGE;
    const wrapper = shallow(<NumberAnswerSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call the correct handlers when the condition is changed", () => {
    const wrapper = shallow(<NumberAnswerSelector {...defaultProps} />);

    wrapper.find(ConditionSelector).simulate("change", { value: "NotEqual" });

    expect(defaultProps.onConditionChange).toHaveBeenCalledWith("NotEqual");
  });

  it("should call the correct handler when value is changed", () => {
    const wrapper = shallow(<NumberAnswerSelector {...defaultProps} />);

    wrapper.find(Number).simulate("change", { value: 123 });
    expect(defaultProps.onRightChange).toHaveBeenCalledWith({
      customValue: { number: 123 },
    });
  });
});
