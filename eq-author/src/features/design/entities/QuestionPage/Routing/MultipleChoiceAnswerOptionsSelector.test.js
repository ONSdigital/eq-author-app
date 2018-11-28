import React from "react";
import { shallow, mount } from "enzyme";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";

let mockHandlers, condition;

describe("components/MultipleChoiceAnswerOptionsSelector", () => {
  beforeEach(() => {
    mockHandlers = {
      onOptionSelectionChange: jest.fn()
    };

    condition = {
      answer: {
        options: [
          { label: "a", id: "1" },
          { label: "b", id: "2" },
          { label: "c", id: "3" }
        ]
      },
      routingValue: {
        value: ["1", "2"]
      }
    };
  });

  it("should render consistently", () => {
    const wrapper = shallow(
      <MultipleChoiceAnswerOptionsSelector
        condition={condition}
        {...mockHandlers}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  it("should handle change events on ToggleChip", () => {
    const wrapper = mount(
      <MultipleChoiceAnswerOptionsSelector
        condition={condition}
        {...mockHandlers}
      />
    );

    wrapper
      .find("input")
      .first()
      .simulate("change");

    expect(mockHandlers.onOptionSelectionChange).toHaveBeenCalledWith(
      condition.id,
      condition.answer.options[0].id,
      expect.anything()
    );
  });

  it("should offer 'other' option if answer has one", () => {
    const other = {
      option: { label: "other", id: "4" }
    };
    condition.answer.other = other;

    const wrapper = mount(
      <MultipleChoiceAnswerOptionsSelector
        condition={condition}
        {...mockHandlers}
      />
    );

    wrapper
      .find("input")
      .findWhere(x => x.closest("label").text() === other.option.label)
      .simulate("change");

    expect(mockHandlers.onOptionSelectionChange).toHaveBeenCalledWith(
      condition.id,
      other.option.id,
      expect.anything()
    );
  });
});
