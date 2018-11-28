import React from "react";
import { shallow } from "enzyme";
import RoutingRuleSet from "./RoutingRuleSet";

let wrapper, props;

describe("components/RoutingRuleSet", () => {
  beforeEach(() => {
    props = {
      onAddRoutingRule: jest.fn(),
      onElseChange: jest.fn(),
      onDeleteRule: jest.fn(),
      onAddRoutingCondition: jest.fn(),
      onToggleConditionOption: jest.fn(),
      onUpdateRoutingCondition: jest.fn(),
      onUpdateConditionValue: jest.fn(),
      onThenChange: jest.fn(),
      pagesAvailableForRouting: [],
      destinations: {},
      ruleSet: {
        id: "1",
        routingRules: [
          {
            id: "2",
            operation: "And"
          },
          {
            id: "3",
            operation: "And"
          }
        ]
      }
    };

    wrapper = shallow(<RoutingRuleSet {...props} />);
  });

  it("should render children", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow change of ELSE condition", () => {
    const data = { name: "hello", value: "there" };
    wrapper.find("[data-test='select-else']").simulate("change", data);

    expect(props.onElseChange).toHaveBeenLastCalledWith({
      id: props.ruleSet.id,
      else: data
    });
  });

  it("should allow adding a rule", () => {
    const found = wrapper.find("[data-test='btn-add-rule']");
    found.simulate("click");
    expect(props.onAddRoutingRule).toHaveBeenCalledWith(props.ruleSet.id);
  });
});
