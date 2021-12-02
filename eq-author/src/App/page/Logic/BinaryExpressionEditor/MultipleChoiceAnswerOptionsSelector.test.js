import React from "react";
import { shallow } from "enzyme";
import { render, act, flushPromises } from "tests/utils/rtl";

import { rightSideErrors } from "constants/validationMessages";
import { colors } from "constants/theme";

import { CHECKBOX, RADIO } from "constants/answer-types";

import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import ToggleChip from "components/buttons/ToggleChip";
import { enableOn } from "utils/featureFlags";

describe("MultipleChoiceAnswerOptionsSelector", () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      expression: {
        id: "Expression-id1",
        left: {
          id: "1",
          type: RADIO,
          options: [
            { label: "a", id: "1" },
            { label: "b", id: "2" },
            { label: "c", id: "3" },
          ],
        },
        right: null,
        validationErrorInfo: {
          totalCount: 0,
          id: "Mult-pass",
          errors: [],
        },
      },
      onRightChange: jest.fn(),
      onConditionChange: jest.fn(),
    };
  });

  it("should render consistently", () => {
    const wrapper = shallow(
      <MultipleChoiceAnswerOptionsSelector {...defaultProps} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("should call onRightChange with the added option when option is checked", () => {
    const wrapper = shallow(
      <MultipleChoiceAnswerOptionsSelector {...defaultProps} />
    );

    wrapper
      .find(ToggleChip)
      .first()
      .simulate("change", { name: "1", value: true });

    expect(defaultProps.onRightChange).toHaveBeenCalledWith({
      selectedOptions: ["1"],
    });
  });

  it("should call onRightChange with the option removed when it is unchecked", () => {
    defaultProps.expression.right = {
      options: [{ id: "1" }, { id: "2" }],
    };
    const wrapper = shallow(
      <MultipleChoiceAnswerOptionsSelector {...defaultProps} />
    );

    wrapper
      .find(ToggleChip)
      .first()
      .simulate("change", { name: "2", value: false });

    expect(defaultProps.onRightChange).toHaveBeenCalledWith({
      selectedOptions: ["1"],
    });
  });

  it("should render a list of previously selected options correctly", () => {
    defaultProps.expression.right = {
      options: [{ id: "1" }, { id: "2" }],
    };

    const wrapper = shallow(
      <MultipleChoiceAnswerOptionsSelector {...defaultProps} />
    );

    expect(wrapper.find(ToggleChip).first().prop("checked")).toBeTruthy();
    expect(wrapper.find(ToggleChip).at(1).prop("checked")).toBeTruthy();
    expect(wrapper.find(ToggleChip).last().prop("checked")).toBeFalsy();
  });

  it("should show error message when right side empty", async () => {
    defaultProps.expression.right = null;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.errorCode,
      field: "right",
      id: "expression-routing-1-right",
      type: "expressions",
    };

    const { getByText } = render(
      <MultipleChoiceAnswerOptionsSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.optionsMessage)
    ).toHaveStyleRule("width", "100%");

    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_NO_VALUE.optionsMessage)
    ).toBeTruthy();
  });

  it("should show error message when group condition is incompatible", async () => {
    defaultProps.expression.condition = "AllOf";
    defaultProps.expression.left.type = CHECKBOX;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode:
        rightSideErrors.ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND
          .errorCode,
      field: "groupCondition",
      id: "123-123-123",
      type: "expressions",
    };

    const { getByText } = render(
      <MultipleChoiceAnswerOptionsSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(
      getByText(
        rightSideErrors.ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND
          .message
      )
    ).toHaveStyleRule("width", "100%");

    expect(
      getByText(
        rightSideErrors.ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND
          .message
      )
    ).toBeTruthy();
  });

  it("should show error message when exclusive OR error", async () => {
    defaultProps.expression.right = null;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: rightSideErrors.ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED.errorCode,
      field: "right",
      id: "expression-routing-1-right",
      type: "expressions",
    };

    const { getByText } = render(
      <MultipleChoiceAnswerOptionsSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED.message)
    ).toHaveStyleRule("width", "100%");

    expect(
      getByText(rightSideErrors.ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED.message)
    ).toBeTruthy();
  });

  it("should display validation error when expression group-wide message passed in", async () => {
    const errorMessage = "Test group error message";
    defaultProps.groupErrorMessage = errorMessage;

    const { getByText } = render(
      <MultipleChoiceAnswerOptionsSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(getByText(errorMessage)).toBeTruthy();

    expect(getByText(errorMessage)).toHaveStyleRule("width", "100%");
  });

  it("should highlight the condition selector when the error includes it", async () => {
    defaultProps.expression = {
      left: {},
      validationErrorInfo: {
        errors: [
          {
            errorCode:
              rightSideErrors.ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE
                .errorCode,
            field: "condition",
            id: "expression-routing-1-right",
            type: "expressions",
          },
        ],
      },
    };

    const { getByTestId } = render(
      <MultipleChoiceAnswerOptionsSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    const dropdown = getByTestId("condition-dropdown");

    expect(dropdown).toHaveStyle(`border: 2px solid ${colors.errorPrimary}`);
  });

  it("should include or in option label when mutually exclusive", async () => {
    defaultProps.expression.left = {
      ...defaultProps.expression.left,
      mutuallyExclusiveOption: { id: "123", label: "hello world" },
      type: CHECKBOX,
    };
    defaultProps.expression.right = {
      options: [
        { label: "a", id: "1" },
        { label: "b", id: "2" },
        { label: "hello world", id: "123" },
      ],
    };

    const { getByText, getByTestId } = render(
      <MultipleChoiceAnswerOptionsSelector {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("mutually-exclusive-separator")).toBeTruthy();
    expect(getByText("or")).toBeTruthy();
    expect(getByText("hello world")).toBeTruthy();
  });

  it("should show secondaryCondition selector and number input when when condition=`CountOf`", async () => {
    defaultProps.expression.left = {
      ...defaultProps.expression.left,
      mutuallyExclusiveOption: { id: "123", label: "hello world" },
      type: CHECKBOX,
    };
    defaultProps.expression.condition = "CountOf";

    const { getByTestId } = render(
      <MultipleChoiceAnswerOptionsSelector {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });
    expect(enableOn(["enableCountCondition"])).toBe(true);
    expect(getByTestId("secondaryCondition-selector")).toBeTruthy();
    expect(getByTestId("secondaryCondition-number-input")).toBeTruthy();
  });

  it("should show secondaryCondition selector error when condition=`CountOf` and selector=null", async () => {
    const errorMessage = "Choose an operator";

    defaultProps.expression.left = {
      ...defaultProps.expression.left,
      mutuallyExclusiveOption: { id: "123", label: "hello world" },
      type: CHECKBOX,
    };
    defaultProps.expression.condition = "CountOf";
    defaultProps.expression.secondaryCondition = null;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: "ERR_SEC_CONDITION_NOT_SELECTED",
      field: "secondaryCondition",
      id: "123-123-123",
      type: "routingExpression",
    };

    const { getByText } = render(
      <MultipleChoiceAnswerOptionsSelector hasError {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });
    expect(getByText(errorMessage)).toBeTruthy();
  });
});
