import React from "react";
import { shallow } from "enzyme";
import { render, flushPromises, act } from "tests/utils/rtl";

import { RADIO, CURRENCY, NUMBER, PERCENTAGE } from "constants/answer-types";
import {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  SELECTED_ANSWER_DELETED,
  DEFAULT_ROUTING,
} from "constants/routing-left-side";
import { byTestAttr } from "tests/utils/selectors";

import { UnwrappedBinaryExpressionEditor as BinaryExpressionEditor } from "./";
import MultipleChoiceAnswerOptionsSelector from "./MultipleChoiceAnswerOptionsSelector";
import NumberAnswerSelector from "./NumberAnswerSelector";

import { OR } from "constants/routingOperators";

describe("BinaryExpressionEditor", () => {
  let defaultProps;
  beforeEach(() => {
    defaultProps = {
      deleteBinaryExpression: jest.fn(),
      updateLeftSide: jest.fn(),
      updateRightSide: jest.fn(),
      updateBinaryExpression: jest.fn(),
      createBinaryExpression: jest.fn(),
      isOnlyExpression: false,
      isLastExpression: false,
      expressionGroupId: "1",
      expression: {
        id: "1",
        left: {
          id: "2",
          type: RADIO,
        },
        condition: "Equal",
        right: null,
        validationErrorInfo: {
          id: "6dd",
          errors: [],
          totalCount: 0,
        },
      },
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

  it("should disable the delete expression button when isOnlyExpression is true", () => {
    const wrapper = shallow(
      <BinaryExpressionEditor {...defaultProps} isOnlyExpression />
    );
    expect(
      wrapper.find(byTestAttr("btn-remove")).prop("disabled")
    ).toBeTruthy();
  });

  it("should render multiple choice editor correctly", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    expect(wrapper.find(MultipleChoiceAnswerOptionsSelector)).toBeTruthy();
  });

  it("should render number editor correctly", () => {
    const answerTypes = [CURRENCY, NUMBER, PERCENTAGE];
    answerTypes.forEach(answerType => {
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

  it("should call deleteBinaryExpression when remove button is clicked", () => {
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-remove")).simulate("click");
    expect(defaultProps.deleteBinaryExpression).toHaveBeenCalledWith(
      defaultProps.expression.id
    );
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

  it("should display the correct error message when there is no routable answer on page", () => {
    defaultProps.expression.left = { reason: NO_ROUTABLE_ANSWER_ON_PAGE };

    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    expect(
      wrapper
        .find("BinaryExpressionEditor__PropertiesError")
        .contains("No routable answers have been added to this question yet")
    ).toBeTruthy();
  });

  it("should display the correct error message when the answer has been deleted", () => {
    defaultProps.expression.left = { reason: SELECTED_ANSWER_DELETED };

    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);

    expect(
      wrapper
        .find("BinaryExpressionEditor__PropertiesError")
        .contains("The answer used in this condition has been deleted")
    ).toBeTruthy();
  });

  it("should display the correct error message when you can't add a second 'And' condition", () => {
    const wrapper = shallow(
      <BinaryExpressionEditor {...defaultProps} canAddCondition={false} />
    );

    expect(
      wrapper
        .find("BinaryExpressionEditor__PropertiesError")
        .contains("AND condition not valid with ‘radio button’ answer")
    ).toBeTruthy();
  });
  it("should display the correct error message when you can't add a second 'Or' condition", () => {
    const wrapper = shallow(
      <BinaryExpressionEditor
        {...defaultProps}
        canAddCondition={false}
        operator={OR}
      />
    );

    expect(
      wrapper
        .find("BinaryExpressionEditor__PropertiesError")
        .contains(
          "OR condition is not valid when creating multiple radio rules"
        )
    ).toBeTruthy();
  });

  it("should update the binary expression when the condition is changed", () => {
    defaultProps.expression.left.type = CURRENCY;
    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);
    wrapper.find(NumberAnswerSelector).simulate("conditionChange", "NotEqual");
    expect(defaultProps.updateBinaryExpression).toHaveBeenCalledWith(
      defaultProps.expression,
      "NotEqual"
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

  it("should not show the delete or add expression buttons when showing defaultRouting", async () => {
    const { getByTestId } = render(
      <BinaryExpressionEditor {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    const actionBtns = getByTestId("action-btns");
    expect(actionBtns).toHaveStyleRule("display: none;");
  });

  it("should not show the condition when showing defaultRouting", async () => {
    const { getByTestId } = render(
      <BinaryExpressionEditor {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    const transition = getByTestId("transition-condition");
    expect(transition).toHaveStyleRule("display: none;");
  });

  it("should return empty div when default routing/skip condition", async () => {
    defaultProps.expression.left.reason = DEFAULT_ROUTING;
    const { queryByTestId } = render(
      <BinaryExpressionEditor {...defaultProps} />
    );

    await act(async () => {
      await flushPromises();
    });

    const options = queryByTestId("options-selector");
    expect(options).toBeFalsy();
  });

  it("should provide validation message when errors are present", async () => {
    defaultProps.expression.validationErrorInfo.totalCount = 1;
    defaultProps.expression.validationErrorInfo.errors[0] = {
      errorCode: "ERR_ANSWER_NOT_SELECTED",
      field: "left",
      id: "expression-routing-1-left",
      type: "expressions",
    };

    const wrapper = shallow(<BinaryExpressionEditor {...defaultProps} />);

    expect(
      wrapper
        .find("BinaryExpressionEditor__PropertiesError")
        .contains("Answer required")
    ).toBeTruthy();
  });
});
