import React from "react";
import { shallow } from "enzyme";
import NumberAnswerSelector, {
  RoutingNumberInput,
  ComparatorSelector
} from "./NumberAnswerSelector";

let mockHandlers, condition;

describe("components/NumberAnswerSelector", () => {
  beforeEach(() => {
    mockHandlers = {
      onComparatorChange: jest.fn(),
      handleValueChange: jest.fn()
    };

    condition = {
      answer: {
        id: "1",
        description: "",
        guidance: "",
        label: "",
        type: "Currency"
      },
      comparator: "Equal",
      id: "2",
      questionPage: { id: "1", displayName: "Untitled Page" },
      routingValue: { id: "6", numberValue: 123 }
    };
  });
  it("should render", () => {
    const wrapper = shallow(
      <NumberAnswerSelector condition={condition} {...mockHandlers} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should call the correct handlers when the comparator is changed", () => {
    const wrapper = shallow(
      <NumberAnswerSelector condition={condition} {...mockHandlers} />
    );

    wrapper.find(ComparatorSelector).simulate("change", { value: "NotEqual" });

    expect(mockHandlers.onComparatorChange).toHaveBeenCalledWith(
      { questionPageId: condition.questionPage.id },
      { value: "NotEqual" }
    );
  });

  it("should call the correct handler when value is changed", () => {
    const wrapper = shallow(
      <NumberAnswerSelector condition={condition} {...mockHandlers} />
    );
    wrapper.find(RoutingNumberInput).simulate("change", { value: 123 });
    expect(mockHandlers.handleValueChange).toHaveBeenCalledWith({
      value: 123
    });
  });
});
