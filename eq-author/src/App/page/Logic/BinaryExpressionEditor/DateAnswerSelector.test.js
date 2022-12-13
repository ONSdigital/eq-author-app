import React from "react";
import { shallow } from "enzyme";
import { render, act, flushPromises } from "tests/utils/rtl";

import {
  rightSideErrors,
  OPERATOR_REQUIRED,
} from "constants/validationMessages";

import { Number } from "components/Forms";

import DateAnswerSelector, { ConditionSelector } from "./DateAnswerSelector";

import { DATE } from "constants/answer-types";

describe("DateAnswerSelector", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      expression: {
        id: "1",
        left: {
          id: "2",
          type: DATE,
        },
        right: null,
        validationErrorInfo: {
          totalCount: 0,
          id: "Date-thing",
          errors: [],
        },
      },
      onRightChange: jest.fn(),
      onConditionChange: jest.fn(),
    };
  });
  it("should render", () => {
    const wrapper = shallow(<DateAnswerSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a Date", () => {
    defaultProps.expression.left.type = DATE;
    const wrapper = shallow(<DateAnswerSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call the correct handlers when the condition is changed", () => {
    const wrapper = shallow(<DateAnswerSelector {...defaultProps} />);

    wrapper
      .find(ConditionSelector)
      .first()
      .simulate("change", { value: "LessThan" });

    expect(defaultProps.onConditionChange).toHaveBeenCalledWith("LessThan");
  });

  it("should call the correct handler when value is changed", () => {
    const wrapper = shallow(<DateAnswerSelector {...defaultProps} />);

    wrapper.find(Number).simulate("change", { value: 123 });
    wrapper.find(Number).simulate("blur");
    expect(defaultProps.onRightChange).toHaveBeenCalledWith({
      dateValue: { offset: 123, offsetDirection: null },
    });
  });

  it("should not show the number input field when unanswered is chosen on a numeric type", () => {
    [DATE].forEach((type) => {
      defaultProps.expression.left.type = type;

      // Ensure the input field is shown
      defaultProps.expression.condition = "LessThan";
      const wrapperWithShownInput = shallow(
        <DateAnswerSelector {...defaultProps} />
      );
      expect(wrapperWithShownInput.find(Number)).toHaveLength(1);

      // Ensure that the input field is hidden after user chooses 'Unanswered'
      defaultProps.expression.condition = null;
      const wrapperWithHiddenInput = shallow(
        <DateAnswerSelector {...defaultProps} />
      );
      expect(wrapperWithHiddenInput.find(Number)).toHaveLength(0);
    });
  });

  it("should display validation error when expression group-wide message passed in", async () => {
    const errorMessage = "Test group error message";
    defaultProps.groupErrorMessage = errorMessage;

    const { getByText } = render(
      <DateAnswerSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(getByText(errorMessage)).toBeTruthy();

    expect(getByText(errorMessage)).toHaveStyleRule("width", "100%");
  });

  it("should show error message when right side empty", () => {
    defaultProps.expression.left.type = DATE;
    defaultProps.expression.right = null;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.errorCode,
      field: "right",
      id: "expression-routing-1-right",
      type: "expressions",
    };

    const { getByText } = render(
      <DateAnswerSelector hasError {...defaultProps} />
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
      <DateAnswerSelector hasError {...defaultProps} />
    );

    expect(getByText(OPERATOR_REQUIRED)).toHaveStyleRule("width", "100%");
    expect(getByText(OPERATOR_REQUIRED)).toBeTruthy();
  });
});
