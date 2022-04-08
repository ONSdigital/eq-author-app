import React from "react";
import { shallow } from "enzyme";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";
import { colors } from "constants/theme";

import RoutingRuleDestinationSelector from "App/page/Logic/Routing/DestinationSelector";
import { RADIO, NUMBER } from "constants/answer-types";
import { AND, OR } from "constants/routingOperators";
import { destinationErrors } from "constants/validationMessages";

import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import { UnwrappedRuleEditor as RuleEditor } from "./";
import { byTestAttr } from "tests/utils/selectors";

const { ERR_DESTINATION_DELETED } = destinationErrors;

describe("RuleEditor", () => {
  let defaultProps, expression;

  const validationErrorInfo = {
    id: "1",
    errors: [],
    totalCount: 0,
    __typename: "ValidationErrorInfo",
  };

  const expressionGroup = {
    id: "1",
    operator: AND,
    expressions: [],
    validationErrorInfo: validationErrorInfo,
    __typename: "ExpressionGroup",
  };

  beforeEach(() => {
    expression = {
      id: "2",
      left: {
        id: "answerId",
        type: NUMBER,
      },
      condition: null,
      secondaryCondition: null,
      right: {},
      expressionGroup: expressionGroup,
      validationErrorInfo: {
        id: "1-2-3",
        errors: [],
        totalCount: 0,
        __typename: "ValidationErrorInfo",
      },
    };

    defaultProps = {
      rule: {
        id: "ruleId",
        expressionGroup: {
          id: "expGrpId",
          operator: AND,
          expressions: [],
          validationErrorInfo: validationErrorInfo,
        },
        destination: {
          id: "1",
          page: {
            id: "pageId",
            displayName: "Page",
          },
          logical: null,
          section: null,
          validationErrorInfo: validationErrorInfo,
        },
        validationErrorInfo: validationErrorInfo,
      },
      canMoveUp: true,
      canMoveDown: true,
      deleteRule: jest.fn(),
      updateRule: jest.fn(),
      updateExpressionGroup: jest.fn(),
      onMoveUp: jest.fn(),
      onMoveDown: jest.fn(),
    };
  });

  it("should render", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow changing of the destination", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    const data = { logical: "EndOfCurrentSection" };
    wrapper.find(RoutingRuleDestinationSelector).simulate("change", data);
    expect(defaultProps.updateRule).toHaveBeenCalledWith({
      ...defaultProps.rule,
      destination: data,
    });
  });

  it("should allow deleting rule", () => {
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-delete-routing-rule")).simulate("click");
    expect(defaultProps.deleteRule).toHaveBeenCalledWith(defaultProps.rule.id);
  });

  it("should pass down the correct prop when a second 'And' condition is invalid", () => {
    defaultProps.rule.expressionGroup.expressions = [
      {
        ...expression,
        left: {
          id: "binaryExpressionId",
          type: RADIO,
        },
      },
      {
        ...expression,
        id: "3",
        left: {
          id: "binaryExpressionId",
          type: RADIO,
        },
      },
    ];

    const wrapper = shallow(<RuleEditor {...defaultProps} />);

    expect(
      wrapper.find(BinaryExpressionEditor).first().prop("canAddCondition")
    ).toBe(true);

    expect(
      wrapper.find(BinaryExpressionEditor).last().prop("canAddCondition")
    ).toBe(false);
  });

  it("should call updateExpressionGroup with 'Or' when OR is selected", async () => {
    defaultProps.rule.expressionGroup.expressions = [
      expression,
      {
        ...expression,
        id: "3",
      },
    ];

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
    newProps.rule.destination.validationErrorInfo = {
      id: "1-2-3",
      errors: [
        {
          errorCode: ERR_DESTINATION_DELETED.errorCode,
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

  it("should highlight the operator dropdown when there is an error related to the operator", async () => {
    defaultProps.rule.expressionGroup.expressions = [
      {
        ...expression,
      },
      {
        ...expression,
        id: "3",
      },
    ];

    defaultProps.rule.expressionGroup.validationErrorInfo = {
      id: "1-2-3",
      errors: [
        {
          errorCode: "ERR_VALUE_REQUIRED",
          field: "operator",
          id: "123-456-789",
          type: "expressionGroup",
          __typename: "ValidationError",
        },
      ],
      totalCount: 1,
      __typename: "ValidationErrorInfo",
    };

    const { getByTestId } = render(<RuleEditor {...defaultProps} />, {
      route: "/q/1/page/2",
      urlParamMatcher: "/q/:questionnaireId/page/:pageId",
    });

    await act(async () => {
      await flushPromises();
    });

    const dropdown = getByTestId("match-select");

    expect(dropdown).toHaveStyle(`border: 2px solid ${colors.errorPrimary}`);
  });

  it("should delete expression group's operator iff penultimate expression deleted", () => {
    defaultProps.rule.expressionGroup.expressions = [expression];
    const wrapper = shallow(<RuleEditor {...defaultProps} />);
    const expressionEditor = wrapper.find(BinaryExpressionEditor);

    expressionEditor.simulate("expressionDeleted", {
      id: "expression-group",
      expressions: [
        { id: "first-expression-standing" },
        { id: "last-expression-standing" },
      ],
    });

    expect(defaultProps.updateExpressionGroup).not.toHaveBeenCalled();

    expressionEditor.simulate("expressionDeleted", {
      id: "expression-group",
      expressions: [{ id: "last-expression-standing" }],
    });

    expect(defaultProps.updateExpressionGroup).toHaveBeenCalledWith({
      id: "expression-group",
      operator: null,
    });
  });

  it("should render static label rather than select element for third expression's group operator", () => {
    defaultProps.rule.expressionGroup.expressions = [
      { ...expression, id: "eeny" },
      { ...expression, id: "meeny" },
    ];
    let wrapper = shallow(<RuleEditor {...defaultProps} />);
    let expressionEditor = wrapper.find(BinaryExpressionEditor).first();
    expect(
      expressionEditor.props().groupOperatorComponent.props.children
    ).not.toBe("AND");

    defaultProps.rule.expressionGroup.expressions.push({
      ...expression,
      id: "miny",
    });
    wrapper = shallow(<RuleEditor {...defaultProps} />);
    expressionEditor = wrapper.find(BinaryExpressionEditor).at(1);
    expect(expressionEditor.props().groupOperatorComponent.props.children).toBe(
      "AND"
    );
  });
});
