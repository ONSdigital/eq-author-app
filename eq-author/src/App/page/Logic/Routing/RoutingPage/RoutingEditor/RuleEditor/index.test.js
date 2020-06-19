import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent, act } from "tests/utils/rtl";

import RoutingRuleDestinationSelector from "App/page/Logic/Routing/DestinationSelector";
import { RADIO } from "constants/answer-types";
import { AND, OR } from "constants/routingOperators";

import BinaryExpressionEditor from "./BinaryExpressionEditor";

import { UnwrappedRuleEditor as RuleEditor } from "./";
import { byTestAttr } from "tests/utils/selectors";

describe("RuleEditor", () => {
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      rule: {
        id: "ruleId",
        expressionGroup: { id: "expGrpId", operator: AND, expressions: [] },
        destination: {
          id: "1",
          page: {
            id: "pageId",
            displayName: "Page",
          },
          logical: null,
          section: null,
        },
      },
      deleteRule: jest.fn(),
      updateRule: jest.fn(),
      updateExpressionGroup: jest.fn(),
    };
  });

  it("should render", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow changing of the destination", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    const data = { logical: "EndOfQuestionnaire" };
    wrapper.find(RoutingRuleDestinationSelector).simulate("change", data);
    expect(defaultProps.updateRule).toHaveBeenCalledWith({
      ...defaultProps.rule,
      destination: data,
    });
  });

  it("should allow deleting rule", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-remove-rule")).simulate("click");
    expect(defaultProps.deleteRule).toHaveBeenCalledWith(defaultProps.rule.id);
  });

  it("should pass down the correct prop when a second 'And' condition is invalid", () => {
    defaultProps.rule.expressionGroup.expressions = [
      {
        id: "2",
        left: {
          id: "binaryExpressionId",
          type: RADIO,
        },
      },
      {
        id: "3",
        left: {
          id: "binaryExpressionId",
          type: RADIO,
        },
      },
    ];

    const wrapper = shallow(<RuleEditor {...defaultProps} />);

    expect(
      wrapper
        .find(BinaryExpressionEditor)
        .first()
        .prop("canAddCondition")
    ).toBe(true);

    expect(
      wrapper
        .find(BinaryExpressionEditor)
        .last()
        .prop("canAddCondition")
    ).toBe(false);
  });

  it("should call updateExpressionGroup with 'Or' when Any of was selected", async () => {
    const { getByTestId } = render(<RuleEditor {...defaultProps} />, {
      route: "/q/1/page/2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
    });
    await act(async () => {
      await fireEvent.change(getByTestId("match-select"), {
        target: { value: OR },
      });
    });

    expect(defaultProps.updateExpressionGroup).toHaveBeenCalledWith({
      id: defaultProps.rule.expressionGroup.id,
      operator: OR,
    });
  });
});
