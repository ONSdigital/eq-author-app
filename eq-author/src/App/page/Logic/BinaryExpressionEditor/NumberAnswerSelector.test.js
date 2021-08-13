import React from "react";
import { shallow } from "enzyme";
import { render, act, flushPromises } from "tests/utils/rtl";

import {
  rightSideErrors,
  OPERATOR_REQUIRED,
} from "constants/validationMessages";

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
    [NUMBER, UNIT, CURRENCY, PERCENTAGE].forEach((type) => {
      defaultProps.expression.left.type = type;

      // Ensure the input field is shown
      defaultProps.expression.condition = "Equal";
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

  it("should display validation error when expression group-wide message passed in", async () => {
    const errorMessage = "Test group error message";
    defaultProps.groupErrorMessage = errorMessage;

    const { getByText } = render(
      <NumberAnswerSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(getByText(errorMessage)).toBeTruthy();

    expect(getByText(errorMessage)).toHaveStyleRule("width", "100%");
  });

  it("should show error message when right side empty", () => {
    defaultProps.expression.left.type = NUMBER;
    defaultProps.expression.right = null;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.errorCode,
      field: "right",
      id: "expression-routing-1-right",
      type: "expressions",
    };

    const { getByText } = render(
      <NumberAnswerSelector hasError {...defaultProps} />
    );

    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.message)
    ).toHaveStyleRule("width", "100%");
    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.message)
    ).toBeTruthy();
  });

  it("should show error message when no operator is selected", () => {
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: OPERATOR_REQUIRED,
      field: "condition",
    };

    const { getByText } = render(
      <NumberAnswerSelector hasError {...defaultProps} />
    );

    expect(getByText(OPERATOR_REQUIRED)).toHaveStyleRule("width", "100%");
    expect(getByText(OPERATOR_REQUIRED)).toBeTruthy();
  });
});
