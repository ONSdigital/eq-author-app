import React from "react";
import { shallow } from "enzyme";
import NumberAnswerValueSelector from "App/questionPage/Routing/NumberAnswerSelector";
import MultipleChoiceAnswerOptionsSelector from "App/questionPage/Routing/MultipleChoiceAnswerOptionsSelector";
import RoutingConditionContentPicker from "App/questionPage/Routing/RoutingConditionContentPicker";
import { UnwrappedRoutingCondition } from "App/questionPage/Routing/RoutingCondition";
import sections from "App/questionPage/Routing/mockstate";
import { byTestAttr } from "tests/utils/selectors";

import { RADIO, TEXTFIELD, CURRENCY, NUMBER } from "constants/answer-types";

let mockHandlers, condition, match;

describe("components/RoutingCondition", () => {
  beforeEach(() => {
    mockHandlers = {
      onConditionChange: jest.fn(),
      onRemove: jest.fn(),
      onToggleOption: jest.fn(),
      onUpdateConditionValue: jest.fn(),
    };

    condition = {
      id: "1",
      questionPage: {
        id: "2",
        displayName: "foobar",
      },
      answer: {
        id: "3",
        type: "Radio",
      },
      comparator: "Equal",
    };

    match = {
      params: {
        questionnaireId: "1",
        sectionId: "2",
        pageId: "3",
      },
    };
  });

  const createWrapper = (props = {}, render = shallow) =>
    render(
      <UnwrappedRoutingCondition
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

  it("should render consistently", () => {
    const wrapper = createWrapper();
    expect(wrapper).toMatchSnapshot();
  });

  it("should render message if question deleted", () => {
    condition.questionPage = null;
    const wrapper = createWrapper();
    expect(wrapper.find(byTestAttr("deleted-answer-msg")).exists()).toBe(true);
  });

  it("should render message if no answer available", () => {
    condition.answer = null;
    const wrapper = createWrapper();
    expect(wrapper.find(byTestAttr("no-answer-msg")).exists()).toBe(true);
  });

  it("should render message if invalid answer type", () => {
    condition.answer.type = TEXTFIELD;
    const wrapper = createWrapper();
    expect(wrapper.find(byTestAttr("invalid-answer-type-msg")).exists()).toBe(
      true
    );
  });

  it("should render message if cannot add and condition", () => {
    const wrapper = createWrapper({
      canAddAndCondition: false,
    });
    expect(wrapper.find(byTestAttr("and-not-valid-msg")).exists()).toBe(true);
  });

  it("should render multiple choice editor correctly", () => {
    condition.answer.type = RADIO;
    const wrapper = createWrapper();
    expect(wrapper.find(MultipleChoiceAnswerOptionsSelector).exists()).toBe(
      true
    );
  });

  it("should render number editor correctly", () => {
    const answerTypes = [CURRENCY, NUMBER];
    answerTypes.forEach(answerType => {
      condition.answer.type = answerType;
      const wrapper = createWrapper();
      expect(wrapper.find(NumberAnswerValueSelector).exists()).toBe(true);
    });
  });

  it("should call onRemove handler when remove button is clicked", () => {
    const wrapper = createWrapper();
    wrapper.find(byTestAttr("btn-remove")).simulate("click");
    expect(mockHandlers.onRemove).toHaveBeenCalled();
  });

  it("should correctly submit from RoutingConditionContentPicker", () => {
    const wrapper = createWrapper();

    wrapper.find(RoutingConditionContentPicker).simulate("submit", {
      value: {
        id: "999",
      },
    });
    expect(mockHandlers.onConditionChange).toHaveBeenCalledWith({
      id: condition.id,
      questionPageId: "999",
    });
  });
});
