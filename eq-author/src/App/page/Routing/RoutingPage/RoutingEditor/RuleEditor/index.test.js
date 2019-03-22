import React from "react";
import { shallow } from "enzyme";
import Button from "components/buttons/Button";
import TextButton from "components/buttons/TextButton";
import RoutingRuleDestinationSelector from "App/page/Routing/DestinationSelector";
import { CURRENCY, RADIO } from "constants/answer-types";

import BinaryExpressionEditor from "./BinaryExpressionEditor";

import { UnwrappedRuleEditor as RuleEditor, Title } from "./";

describe("RuleEditor", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      rule: {
        id: "ruleId",
        expressionGroup: {
          id: "expressionGroupId",
          expressions: [
            {
              id: "1",
              left: {
                id: "binaryExpressionId",
                type: CURRENCY,
              },
            },
          ],
        },
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
      createBinaryExpression: jest.fn(),
      deleteRule: jest.fn(),
      updateRule: jest.fn(),
    };
  });

  it("should render", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a title when provided", () => {
    defaultProps.title = "My title";
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    expect(wrapper.find(Title).exists()).toBe(true);
  });

  it("should allow deleting rule", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    wrapper.find(Button).simulate("click");
    expect(defaultProps.deleteRule).toHaveBeenCalledWith(defaultProps.rule.id);
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

  it("allows adding of a new binary expression", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    wrapper.find(TextButton).simulate("click");
    expect(defaultProps.createBinaryExpression).toHaveBeenCalledWith(
      defaultProps.rule.expressionGroup.id
    );
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
        .prop("canAddAndCondition")
    ).toBe(true);

    expect(
      wrapper
        .find(BinaryExpressionEditor)
        .last()
        .prop("canAddAndCondition")
    ).toBe(false);
  });
});
