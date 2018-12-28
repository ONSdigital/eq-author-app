import React from "react";
import { shallow } from "enzyme";
import Button from "components/Buttons/Button";
import TextButton from "components/Buttons/TextButton";
import RoutingCondition from "App/QuestionPage/Routing/RoutingCondition";
import RoutingRuleDestinationSelector from "App/QuestionPage/Routing/RoutingRuleDestinationSelector";
import RoutingRule from "App/QuestionPage/Routing/RoutingRule";

let wrapper, props;

describe("components/RoutingRule", () => {
  beforeEach(() => {
    props = {
      rule: {
        id: "1",
        conditions: [
          { id: "2", answer: { id: "1" } },
          { id: "3", answer: { id: "2" } }
        ]
      },
      onAddRule: jest.fn(),
      onDeleteRule: jest.fn(),
      onThenChange: jest.fn(),
      onAddRoutingCondition: jest.fn(),
      onToggleConditionOption: jest.fn(),
      onUpdateRoutingCondition: jest.fn(),
      onDeleteRoutingCondition: jest.fn(),
      onUpdateConditionValue: jest.fn(),
      title: "Test",
      destinations: {},
      pagesAvailableForRouting: [],
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2",
          pageId: "3"
        }
      }
    };

    wrapper = shallow(<RoutingRule {...props} />);
  });

  it("should render children", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow deleting rule", () => {
    wrapper.find(Button).simulate("click");
    expect(props.onDeleteRule).toHaveBeenCalled();
  });

  it("should not allow deletion when there is only one condition", () => {
    props.rule.conditions = [{ id: "2", answer: { id: "1" } }];

    wrapper = shallow(<RoutingRule {...props} />);
    wrapper.find(RoutingCondition).simulate("remove");

    expect(props.onDeleteRoutingCondition).not.toHaveBeenCalled();
  });

  it("should allow change of THEN condition", () => {
    const data = { name: "hello", value: "there" };
    wrapper.find(RoutingRuleDestinationSelector).simulate("change", data);

    expect(props.onThenChange).toHaveBeenLastCalledWith({
      goto: data,
      id: "1"
    });
  });

  it("should disable adding of condition if more than one condition refers to same radio answer", () => {
    props.rule.conditions = [
      {
        id: "1",
        answer: { type: "Radio", id: "1" }
      },
      {
        id: "2",
        answer: { type: "Radio", id: "1" }
      }
    ];

    wrapper = shallow(<RoutingRule {...props} />);

    const firstCondition = wrapper.find(RoutingCondition).first();
    expect(firstCondition.prop("canAddAndCondition")).toBe(true);

    const lastCondition = wrapper.find(RoutingCondition).last();
    expect(lastCondition.prop("canAddAndCondition")).toBe(false);
  });

  it("allows adding of new condition", () => {
    wrapper.find(TextButton).simulate("click");

    expect(props.onAddRoutingCondition).toHaveBeenCalledWith(props.rule);
  });
});
