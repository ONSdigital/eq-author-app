import React from "react";
import { shallow } from "enzyme";

import { RADIO } from "constants/answer-types";

import BinaryExpressionEditor from "App/page/Logic/BinaryExpressionEditor";

import { UnwrappedSkipConditionEditor as SkipConditionEditor } from "./";
import { byTestAttr } from "tests/utils/selectors";

describe("SkipConditionEditor", () => {
  let defaultProps;
  let defaultPropsMiddle;

  beforeEach(() => {
    defaultProps = {
      pageId: "1",
      expressionGroup: { id: "expGrpId", expressions: [] },
      expressionGroupIndex: 0,
      deleteSkipCondition: jest.fn(),
      deleteSkipConditions: jest.fn(),
    };
    defaultPropsMiddle = {
      pageId: "1",
      expressionGroup: { id: "expGrpId", expressions: [] },
      expressionGroupIndex: 1,
      deleteSkipCondition: jest.fn(),
      deleteSkipConditions: jest.fn(),
    };
  });

  it("should render", () => {
    const wrapper = shallow(<SkipConditionEditor {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow deleting all skip conditions", () => {
    const wrapper = shallow(<SkipConditionEditor {...defaultProps} />);
    wrapper.find(byTestAttr("btn-remove-skip-conditions")).simulate("click");
    expect(defaultProps.deleteSkipConditions).toHaveBeenCalledWith(
      defaultProps.pageId
    );
  });

  it("should allow deleting or skip conditions", () => {
    const wrapper = shallow(<SkipConditionEditor {...defaultPropsMiddle} />);
    wrapper.find(byTestAttr("btn-remove-skip-condition")).simulate("click");
    expect(defaultPropsMiddle.deleteSkipCondition).toHaveBeenCalledWith(
      defaultPropsMiddle.expressionGroup.id
    );
  });

  it("should pass down the correct prop when a second 'And' condition is invalid", () => {
    defaultProps.expressionGroup.expressions = [
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

    const wrapper = shallow(<SkipConditionEditor {...defaultProps} />);

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
});
