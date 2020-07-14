import React from "react";
import { shallow } from "enzyme";
import { render, act, flushPromises } from "tests/utils/rtl";

import { rightSideErrors } from "constants/validationMessages";

import { RADIO } from "constants/answer-types";

import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import ToggleChip from "components/buttons/ToggleChip";

describe("MultipleChoiceAnswerOptionsSelector", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      expression: {
        left: {
          id: "1",
          type: RADIO,
          options: [
            { label: "a", id: "1" },
            { label: "b", id: "2" },
            { id: "3" },
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

    expect(
      wrapper
        .find(ToggleChip)
        .first()
        .prop("checked")
    ).toBeTruthy();
    expect(
      wrapper
        .find(ToggleChip)
        .at(1)
        .prop("checked")
    ).toBeTruthy();
    expect(
      wrapper
        .find(ToggleChip)
        .last()
        .prop("checked")
    ).toBeFalsy();
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
});
