import React from "react";
import { shallow } from "enzyme";
import { render, flushPromises, act, screen } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";

import { RADIO, CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";
import {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  SELECTED_ANSWER_DELETED,
  DEFAULT_ROUTING,
} from "constants/routing-left-side";

import { byTestAttr } from "tests/utils/selectors";

import { UnwrappedBinaryExpressionEditor as BinaryExpressionEditor } from ".";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import NumberAnswerSelector from "./NumberAnswerSelector";

import { binaryExpressionErrors } from "constants/validationMessages";

import { OR } from "constants/routingOperators";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(() => [() => null]),
}));

describe("BinaryExpressionEditor", () => {
  let defaultProps, expression, expressionGroup;
  beforeEach(() => {
    expression = {
      id: "1",
      left: {
        id: "2",
        type: RADIO,
      },
      condition: "Equal",
      secondaryCondition: null,
      right: null,
      validationErrorInfo: {
        id: "6dd",
        errors: [],
        totalCount: 0,
      },
    };

    expressionGroup = {
      expressions: [expression],
    };

    expression.expressionGroup = {
      id: "1",
      validationErrorInfo: { id: "1", errors: [], totalCount: 0 },
      __typename: "ExpressionGroup2",
    };

    defaultProps = {
      deleteBinaryExpression: jest.fn(),
      updateLeftSide: jest.fn(),
      updateRightSide: jest.fn(),
      updateBinaryExpression: jest.fn(),
      createBinaryExpression: jest.fn(),
      isOnlyExpression: false,
      isLastExpression: false,
      expressionGroup,
      expression,
      expressionIndex: 0,
      canAddCondition: true,
      match: {
        params: {
          questionnaireId: "1",
          sectionId: "2",
          pageId: "3",
        },
      },
    };
  });

  it("should render consistently", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should disable the delete expression button when there's only one expression and conditionType is not skip", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    expect(
      wrapper.find(byTestAttr("btn-remove")).prop("disabled")
    ).toBeTruthy();
  });

  it("should not disable the delete expression button when there's only one expression and conditionType is skip", () => {
    defaultProps.conditionType = "skip";
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    expect(wrapper.find(byTestAttr("btn-remove")).prop("disabled")).toBeFalsy();
  });

  it("should render multiple choice editor correctly", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    expect(wrapper.find(MultipleChoiceAnswerOptionsSelector)).toBeTruthy();
  });

  it("should render number editor correctly", () => {
    const answerTypes = [CURRENCY, NUMBER, PERCENTAGE];
    answerTypes.forEach((answerType) => {
      defaultProps.expression.left.type = answerType;
      const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
      expect(wrapper.find(NumberAnswerSelector)).toBeTruthy();
    });
  });

  it("should call createBinaryExpression when add button is clicked", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-add")).simulate("click");
    expect(defaultProps.createBinaryExpression).toHaveBeenCalledWith(
      defaultProps.expressionGroupId
    );
  });

  it("should call deleteBinaryExpression when remove button is clicked and expressions length is greater than 1", () => {
    // Pushes newExpression to expressions array to increase expressions length above 1
    const newExpression = {
      id: "2",
      left: {
        id: "3",
        type: RADIO,
      },
      condition: "Equal",
      secondaryCondition: null,
      right: null,
      validationErrorInfo: {
        id: "6dd",
        errors: [],
        totalCount: 0,
      },
    };
    defaultProps.expressionGroup.expressions.push({ newExpression });

    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-remove")).simulate("click");
    expect(defaultProps.deleteBinaryExpression).toHaveBeenCalledWith(
      defaultProps.expression.id,
      expect.any(Function)
    );
  });

  it("should call deleteSkipCondition when remove button is clicked, expressions length is 1 and conditionType is skip", () => {
    const deleteSkipCondition = jest.fn();
    defaultProps.conditionType = "skip";
    useMutation.mockImplementationOnce(jest.fn(() => [deleteSkipCondition]));

    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-remove")).simulate("click");
    expect(deleteSkipCondition).toHaveBeenCalledWith({
      variables: { input: { id: defaultProps.expressionGroup.id } },
    });
  });

  it("should correctly submit from RoutingAnswerContentPicker", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);

    wrapper.find(byTestAttr("routing-answer-picker")).simulate("submit", {
      value: {
        id: "999",
      },
    });
    expect(defaultProps.updateLeftSide).toHaveBeenCalledWith(
      defaultProps.expression,
      "999"
    );
  });

  it("should display the correct error message when there is no routable answer on page", async () => {
    defaultProps.expression.left = { reason: NO_ROUTABLE_ANSWER_ON_PAGE };

    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(
      screen.getByText(
        "No routable answers have been added to this question yet"
      )
    ).toBeTruthy();
  });

  it("should display the correct error message when the answer has been deleted", async () => {
    defaultProps.expression.left = { reason: SELECTED_ANSWER_DELETED };

    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(
      screen.getByText("The answer used in this condition has been deleted")
    ).toBeTruthy();
  });

  it("should display the correct error message when the routable answer has been moved after the routing Question", async () => {
    defaultProps.expression.validationErrorInfo.totalCount = 1;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: "ERR_LEFTSIDE_NO_LONGER_AVAILABLE",
      field: "left",
      id: "expression-routing-1-left",
      type: "expressions",
    };
    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(
      screen.getByText(
        "Select an answer that is not later on in the questionnaire"
      )
    ).toBeTruthy();
  });

  it("should display the correct error message when you can't add a second 'And' condition", async () => {
    render(
      <BinaryExpressionEditor {...defaultProps} canAddCondition={false} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(
      screen.getByText("AND condition not valid with 'radio button' answer")
    ).toBeTruthy();
  });
  it("should display the correct error message when you can't add a second 'Or' condition", async () => {
    defaultProps.expressionGroup.operator = OR;

    render(
      <BinaryExpressionEditor {...defaultProps} canAddCondition={false} />
    );

    await act(async () => {
      await flushPromises();
    });

    expect(
      screen.getByText(
        "OR condition is not valid when creating multiple radio rules"
      )
    ).toBeTruthy();
  });

  it("should update the binary expression when the condition is changed", () => {
    defaultProps.expression.left.type = CURRENCY;
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper
      .find(NumberAnswerSelector)
      .simulate("conditionChange", "NotEqual", null);
    expect(defaultProps.updateBinaryExpression).toHaveBeenCalledWith(
      defaultProps.expression,
      "NotEqual",
      null
    );
  });

  it("should update the right side when the right side is changed", () => {
    defaultProps.expression.left.type = NUMBER;
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper
      .find(NumberAnswerSelector)
      .simulate("rightChange", { customValue: { number: 123 } });
    expect(defaultProps.updateRightSide).toHaveBeenCalledWith(
      defaultProps.expression,
      {
        customValue: { number: 123 },
      }
    );
  });

  it("leftside should not be null when updating answer selector", () => {
    defaultProps.expression.left.type = NUMBER;
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(NumberAnswerSelector);
    expect(defaultProps.updateLeftSide).not.toBeNull();
  });

  it("rightside should not be null when updating answer selector", () => {
    defaultProps.expression.left.type = NUMBER;
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(NumberAnswerSelector);
    expect(defaultProps.updateRightSide).not.toBeNull();
  });

  it("should not show the delete or add expression buttons when showing defaultRouting", async () => {
    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    const actionBtns = screen.getByTestId("action-btns");
    expect(actionBtns).toHaveStyleRule("display: none;");
  });

  it("should not show the expression editor when showing defaultRouting", async () => {
    defaultProps.expression.left.reason = DEFAULT_ROUTING;
    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    const operatorSelect = screen.queryByText("Select an operator");
    expect(operatorSelect).toBeFalsy();
  });

  it("should provide validation message when errors are present", async () => {
    defaultProps.expression.validationErrorInfo.totalCount = 1;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: "ERR_ANSWER_NOT_SELECTED",
      field: "left",
      id: "expression-routing-1-left",
      type: "expressions",
    };

    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(screen.getByTestId("action-btns")).toHaveStyleRule("display: flex;");
    expect(screen.getByText("Answer required")).toBeTruthy();
  });

  it("should pass on shared expressionGroup messages when group errors are present", async () => {
    defaultProps.expression.expressionGroup = {
      id: "1",
      validationErrorInfo: {
        id: "err-1",
        totalCount: 1,
        errors: [
          {
            errorCode: "ERR_LOGICAL_AND",
            field: "2",
            id: "exp_1",
            type: "expressions",
          },
        ],
      },
    };

    const { getByText } = render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(getByText(binaryExpressionErrors.ERR_LOGICAL_AND)).toBeTruthy();
  });

  it("shouldn't pass on shared expressionGroup messages when group errors are present for a different answerId", async () => {
    defaultProps.expression.expressionGroup = {
      id: "1",
      validationErrorInfo: {
        id: "1",
        totalCount: 1,
        errors: [
          {
            errorCode: "ERR_LOGICAL_AND",
            field: "different_answer_id",
            id: "1",
            type: "expressions",
          },
        ],
      },
    };

    render(<BinaryExpressionEditor {...defaultProps} />);

    await act(async () => {
      await flushPromises();
    });

    expect(
      screen.queryByText(binaryExpressionErrors.ERR_LOGICAL_AND)
    ).toBeNull();
  });
});
