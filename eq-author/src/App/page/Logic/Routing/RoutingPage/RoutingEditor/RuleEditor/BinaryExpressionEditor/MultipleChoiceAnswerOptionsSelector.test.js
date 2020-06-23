import React from "react";
import { shallow } from "enzyme";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import ToggleChip from "components/buttons/ToggleChip";

describe("MultipleChoiceAnswerOptionsSelector", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      expression: {
        left: {
          id: "1",
          type: "Radio",
          options: [
            { label: "a", id: "1" },
            { label: "b", id: "2" },
            { label: "c", id: "3" },
          ],
        },
        right: null,
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
});
