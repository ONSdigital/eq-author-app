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
} from "constants/answer-types";

import MultipleChoiceAnswer from "App/questionPage/Design/answers/MultipleChoiceAnswer";
import Date from "App/questionPage/Design/answers/Date";

import AnswerEditor from "./";

describe("Answer Editor", () => {
  let mockMutations;
  let mockAnswer;
  let mockMultipleChoiceAnswer;

  const createWrapper = (props, render = shallow) => {
    return render(<AnswerEditor {...props} />);
  };

  beforeEach(() => {
    mockMutations = {
      onDeleteAnswer: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onAddOption: jest.fn(),
      onUpdateOption: jest.fn(),
      onDeleteOption: jest.fn(),
      onAddExclusive: jest.fn(),
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
    };

    mockMultipleChoiceAnswer = {
      ...mockAnswer,
      type: CHECKBOX,
      options: [
        {
          id: "1",
          label: "",
          description: "",
        },
      ],
    };
  });

  it("should render TextField", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Number", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: NUMBER },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Currency", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: CURRENCY },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Percentage", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: PERCENTAGE },
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

  it("should render Checkbox", () => {
    const wrapper = createWrapper({
      answer: mockMultipleChoiceAnswer,
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Radio", () => {
    const wrapper = createWrapper({
      answer: {
        ...mockMultipleChoiceAnswer,
        type: RADIO,
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render DateRange", () => {
    const wrapper = createWrapper({
      answer: {
        ...mockAnswer,
        type: DATE_RANGE,
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Date", () => {
    const wrapper = createWrapper({
      answer: {
        ...mockAnswer,
        type: DATE,
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should call handler when answer deleted", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });

    wrapper
      .find(DeleteButton)
      .first()
      .simulate("click");
    expect(mockMutations.onDeleteAnswer).toHaveBeenCalledWith(mockAnswer.id);
  });

  it("should call handler when answer moved down", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });

    wrapper.find("[data-test='btn-move-answer-down']").simulate("click");
    expect(mockMutations.onMoveDown).toHaveBeenCalled();
  });

  it("should call handler when answer moved up", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      ...mockMutations,
    });

    wrapper.find("[data-test='btn-move-answer-up']").simulate("click");
    expect(mockMutations.onMoveUp).toHaveBeenCalled();
  });

  it("should add an option to answer via `id`", () => {
    const wrapper = createWrapper({
      answer: mockMultipleChoiceAnswer,
      ...mockMutations,
    });
    wrapper.find(MultipleChoiceAnswer).simulate("addOption");
    expect(mockMutations.onAddOption).toHaveBeenCalled();
  });

  it("should correctly calculates date format", () => {
    const formats = ["yyyy", "mm/yyyy", "dd/mm/yyyy"];

    map(formats, format => {
      const wrapper = createWrapper({
        answer: {
          ...mockAnswer,
          type: DATE,
          properties: { format: format },
        },
        ...mockMutations,
      });
      expect(wrapper.find(Date)).toMatchSnapshot();
    });
  });
});
