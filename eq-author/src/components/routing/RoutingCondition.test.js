import React from "react";
import { shallow, mount } from "enzyme";

import RoutingCondition from "./RoutingCondition";

import sections from "./mockstate";

let mockHandlers, condition, match;

describe("components/RoutingCondition", () => {
  beforeEach(() => {
    mockHandlers = {
      onConditionChange: jest.fn(),
      onRemove: jest.fn(),
      onToggleOption: jest.fn(),
      onUpdateConditionValue: jest.fn()
    };

    condition = {
      id: "1",
      questionPage: {
        id: "2"
      },
      answer: {
        id: "3",
        type: "Radio"
      }
    };

    match = {
      params: {
        questionnaireId: "1",
        sectionId: "2",
        pageId: "3"
      }
    };
  });

  const createWrapper = (props = {}, render = shallow) =>
    render(
      <RoutingCondition
        id="test"
        ruleId="1"
        sections={sections}
        condition={condition}
        canAddAndCondition
        match={match}
        {...mockHandlers}
        {...props}
      />
    );

  const testId = id => `[data-test="${id}"]`;

  it("should render consistently", () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render message if question deleted", () => {
    condition.questionPage = null;
    const wrapper = createWrapper();
    expect(wrapper.find(testId("deleted-answer-msg")).exists()).toBe(true);
  });

  it("should render message if no answer available", () => {
    condition.answer = null;
    const wrapper = createWrapper();
    expect(wrapper.find(testId("no-answer-msg")).exists()).toBe(true);
  });

  it("should render message if invalid answer type", () => {
    condition.answer.type = "Text";
    const wrapper = createWrapper();
    expect(wrapper.find(testId("invalid-answer-type-msg")).exists()).toBe(true);
  });

  it("should render option selector if everything is ok", () => {
    const wrapper = createWrapper({}, mount);
    expect(wrapper.find(testId("options-selector")).exists()).toBe(true);
  });

  it("should call onRemove handler when remove button is clicked", () => {
    const wrapper = createWrapper();
    wrapper.find("[data-test='btn-remove']").simulate("click");
    expect(mockHandlers.onRemove).toHaveBeenCalled();
  });

  it("should call onUpdate with value of selected page", () => {
    const wrapper = createWrapper({}, mount);

    wrapper.find("select").simulate("change");
    expect(mockHandlers.onConditionChange).toHaveBeenCalledWith({
      id: condition.id,
      questionPageId: condition.questionPage.id
    });
  });
});
