import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";

import RoutingRuleDestinationSelector from "App/page/Logic/Routing/DestinationSelector";
import { RADIO } from "constants/answer-types";
import { AND, OR } from "constants/routingOperators";

import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

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
        validationErrorInfo: {
          id: "1-2-3",
          errors: [],
          totalCount: 0,
          __typename: "ValidationErrorInfo",
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

  it("should not display the validation message text beneath the destination selector, if there are no errors", async () => {
    const { getByTestId } = render(<RuleEditor {...defaultProps} />, {
      route: "/q/1/page/2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
    });

    await act(async () => {
      await flushPromises();
    });

    expect(() => getByTestId("destination-validation-error")).toThrow();
  });

  it("should display the validation message text beneath the destination selector, if it has an error", async () => {
    const newProps = defaultProps;
    newProps.rule.validationErrorInfo = {
      id: "1-2-3",
      errors: [
        {
          errorCode: "ERR_DESTINATION_DELETED",
          field: "destination",
          id: "rules-4-5-6-destination",
          type: "rules",
          __typename: "ValidationError",
        },
      ],
      totalCount: 1,
      __typename: "ValidationErrorInfo",
    };

    const { getByTestId } = render(<RuleEditor {...newProps} />, {
      route: "/q/1/page/2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
    });

    await act(async () => {
      await flushPromises();
    });

    expect(getByTestId("destination-validation-error")).toBeTruthy();
  });
});
