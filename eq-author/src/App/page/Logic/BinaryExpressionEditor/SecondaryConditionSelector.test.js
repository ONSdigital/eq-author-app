import React from "react";
import { shallow } from "enzyme";
import { render, act, flushPromises } from "tests/utils/rtl";

import SecondaryConditionSelector, {
  Selector,
  StyledNumber,
} from "./SecondaryConditionSelector";

import { CURRENCY, NUMBER, PERCENTAGE, UNIT } from "constants/answer-types";

describe("secondaryConditionSelector", () => {
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
    const wrapper = shallow(<SecondaryConditionSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a currency", () => {
    defaultProps.expression.left.type = CURRENCY;
    const wrapper = shallow(<SecondaryConditionSelector {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a percentage", () => {
    defaultProps.expression.left.type = PERCENTAGE;
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

  // it("should display validation error when expression group-wide message passed in", async () => {
  //   const errorMessage = "Test group error message";
  //   defaultProps.groupErrorMessage = errorMessage;

  //   const { getByText } = render(
  //     <SecondaryConditionSelector hasError {...defaultProps} />
  //   );

  //   await act(async () => {
  //     await flushPromises();
  //   });

  //   expect(getByText(errorMessage)).toBeTruthy();

  //   expect(getByText(errorMessage)).toHaveStyleRule("width", "100%");
  // });

  // it("should show error message when right side empty", () => {
  //   defaultProps.expression.left.type = NUMBER;
  //   defaultProps.expression.right = null;
  //   defaultProps.expression.validationErrorInfo.errors[0] = {
  //     errorCode: rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.errorCode,
  //     field: "right",
  //     id: "expression-routing-1-right",
  //     type: "routingExpression",
  //   };

  //   const { getByText } = render(
  //     <SecondaryConditionSelector hasError {...defaultProps} />
  //   );

  //   expect(
  //     getByText(rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.message)
  //   ).toHaveStyleRule("width", "100%");
  //   expect(
  //     getByText(rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.message)
  //   ).toBeTruthy();
  // });

  // it("should show error message when no operator is selected", () => {
  //   defaultProps.expression.validationErrorInfo.errors[0] = {
  //     errorCode: OPERATOR_REQUIRED,
  //     field: "secondaryCondition",
  //   };

  //   const { getByText } = render(
  //     <SecondaryConditionSelector hasError {...defaultProps} />
  //   );

  //   expect(getByText(OPERATOR_REQUIRED)).toHaveStyleRule("width", "195px");
  //   expect(getByText(OPERATOR_REQUIRED)).toBeTruthy();
  // });
});
