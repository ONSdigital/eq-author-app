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
  SELECT,
  MUTUALLY_EXCLUSIVE,
} from "constants/answer-types";

import { CENTIMETRES } from "constants/unit-types";
import { YEARSMONTHS } from "constants/duration-types";

import MultipleChoiceAnswer from "App/page/Design/answers/MultipleChoiceAnswer";
import Date from "App/page/Design/answers/Date";

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
      multipleAnswers: false,
    };

    mockAnswer = {
      id: "1",
      title: "",
      page: { id: "1" },
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
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Number", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: NUMBER },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Currency", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: CURRENCY },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Percentage", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: PERCENTAGE },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render TextArea", () => {
    const wrapper = createWrapper({
      answer: { ...mockAnswer, type: TEXTAREA },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Checkbox", () => {
    const wrapper = createWrapper({
      answer: mockMultipleChoiceAnswer,
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
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
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Select", () => {
    const wrapper = createWrapper({
      answer: { ...mockMultipleChoiceAnswer, type: SELECT },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
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
      page: {
        id: "page-1",
        pageType: "QuestionPage",
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
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Unit", () => {
    const wrapper = createWrapper({
      answer: {
        ...mockAnswer,
        type: UNIT,
        properties: {
          unit: CENTIMETRES,
        },
      },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Duration", () => {
    const wrapper = createWrapper({
      answer: {
        ...mockAnswer,
        type: DURATION,
        properties: {
          unit: YEARSMONTHS,
        },
      },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should render Mutually Exclusive", () => {
    const wrapper = createWrapper({
      answer: {
        ...mockMultipleChoiceAnswer,
        type: MUTUALLY_EXCLUSIVE,
      },
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should call handler when answer deleted", async () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });

    wrapper.find(DeleteButton).first().simulate("click");
    const deleteConfirmModal = wrapper.find("Modal");
    deleteConfirmModal.simulate("confirm");

    expect(mockMutations.onDeleteAnswer).toHaveBeenCalledWith(mockAnswer.id);
  });

  it("should close delete modal", async () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });

    wrapper.find(DeleteButton).first().simulate("click");
    expect(wrapper.state("showDeleteModal")).toEqual(true);
    const deleteConfirmModal = wrapper.find("Modal");
    deleteConfirmModal.simulate("close");
    expect(wrapper.state("showDeleteModal")).toEqual(false);
  });

  it("should call handler when answer moved down", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });

    wrapper.find("[data-test='btn-move-answer-down']").simulate("click");
    expect(mockMutations.onMoveDown).toHaveBeenCalled();
  });

  it("should call handler when answer moved up", () => {
    const wrapper = createWrapper({
      answer: mockAnswer,
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });

    wrapper.find("[data-test='btn-move-answer-up']").simulate("click");
    expect(mockMutations.onMoveUp).toHaveBeenCalled();
  });

  it("should add an option to answer via `id`", () => {
    const wrapper = createWrapper({
      answer: mockMultipleChoiceAnswer,
      page: {
        id: "page-1",
        pageType: "QuestionPage",
      },
      ...mockMutations,
    });
    wrapper.find(MultipleChoiceAnswer).simulate("addOption");
    expect(mockMutations.onAddOption).toHaveBeenCalled();
  });

  it("should correctly calculates date format", () => {
    const formats = ["yyyy", "mm/yyyy", "dd/mm/yyyy"];

    map(formats, (format) => {
      const wrapper = createWrapper({
        answer: {
          ...mockAnswer,
          type: DATE,
          properties: { format: format },
        },
        page: {
          id: "page-1",
          pageType: "QuestionPage",
        },
        ...mockMutations,
      });
      expect(wrapper.find(Date)).toMatchSnapshot();
    });
  });
});
