import React from "react";
import { shallow } from "enzyme";

import { Number } from "components/Forms";

import NumberAnswerSelector, {
  ConditionSelector,
} from "./NumberAnswerSelector";

import { CURRENCY, NUMBER, PERCENTAGE, UNIT } from "constants/answer-types";

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
    wrapper.find(Number).simulate("blur");
    expect(defaultProps.onRightChange).toHaveBeenCalledWith({
      customValue: { number: 123 },
    });
  });

  it("should not show the number input field when unanswered is chosen on a numeric type", () => {
    [NUMBER, UNIT, CURRENCY, PERCENTAGE].forEach(type => {
      defaultProps.expression.left.type = type;

      // Needs to be reset on each iteration to ensure the input field can be tested properly, otherwise first expect will fail on iterations > 1
      defaultProps.expression.condition = null;

      // Ensure the input field is shown
      const wrapperWithShownInput = shallow(
        <NumberAnswerSelector {...defaultProps} />
      );
      expect(wrapperWithShownInput.find(Number)).toHaveLength(1);

      // Ensure that the input field is hidden after user chooses 'Unanswered'
      defaultProps.expression.condition = "Unanswered";
      const wrapperWithHiddenInput = shallow(
        <NumberAnswerSelector {...defaultProps} />
      );
      expect(wrapperWithHiddenInput.find(Number)).toHaveLength(0);
    });
  });
});
