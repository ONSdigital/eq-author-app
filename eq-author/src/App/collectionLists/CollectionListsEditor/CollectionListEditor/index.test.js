import React from "react";
import { shallow } from "enzyme";
import { map } from "lodash";

import DeleteButton from "components/buttons/DeleteButton";
import {
  TEXTFIELD,
  NUMBER,
  CURRENCY,
  TEXTAREA,
  CHECKBOX,
  RADIO,
  DATE_RANGE,
  DATE,
  PERCENTAGE,
  UNIT,
  DURATION,
} from "constants/answer-types";

import { CENTIMETRES } from "constants/unit-types";
import { YEARSMONTHS } from "constants/duration-types";

import MultipleChoiceAnswer from "App/page/Design/answers/MultipleChoiceAnswer";
import Date from "App/page/Design/answers/Date";

import AnswerEditor from "./";

describe("Answer Editor", () => {
  let mockMutations;
  let mockAnswer;

  const createWrapper = (props, render = shallow) => {
    return render(<AnswerEditor {...props} />);
  };

  beforeEach(() => {
    mockMutations = {
      onDeleteCollectionList: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onMoveDown: jest.fn(),
      onMoveUp: jest.fn(),
      canMoveUp: true,
      canMoveDown: true,
    };

    mockAnswer = {
      id: "1",
      title: "",
      description: "",
      type: TEXTFIELD,
      guidance: "",
      label: "",
      secondaryLabel: "",
      secondaryLabelDefault: "",
      properties: {},
      displayName: "",
      qCode: "",
      advancedProperties: false,
    };

  });

  it("should render TextField", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render TextArea", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: TEXTAREA },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should call handler when list deleted", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });
    wrapper.find(DeleteButton).first().simulate("click");
    expect(mockMutations.onDeleteCollectionList).toHaveBeenCalled();
  });

  it("should call handler when list moved down", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });

    wrapper.find("[data-test='btn-move-answer-down']").simulate("click");
    expect(mockMutations.onMoveDown).toHaveBeenCalled();
  });

  it("should call handler when list moved up", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });

    wrapper.find("[data-test='btn-move-answer-up']").simulate("click");
    expect(mockMutations.onMoveUp).toHaveBeenCalled();
  });

});
