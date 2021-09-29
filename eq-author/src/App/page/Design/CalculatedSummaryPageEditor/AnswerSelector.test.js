import React from "react";
import { shallow } from "enzyme";

import { NUMBER } from "constants/answer-types";

import { useQuestionnaire } from "components/QuestionnaireContext";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import {
  UnwrappedAnswerSelector as AnswerSelector,
  ErrorContext,
} from "../AnswerSelector";
import AnswerChip from "./AnswerChip";

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

describe("AnswerSelector", () => {
  let questionnaire, mockHandlers, page, answers;
  beforeEach(() => {
    mockHandlers = {
      fetchAnswers: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
      onUpdateCalculatedSummaryPage: jest.fn(),
      getValidationError: jest.fn(),
    };

    questionnaire = buildQuestionnaire({
      sectionCount: 1,
      pageCount: 1,
    });
    page = {
      id: "2",
      title: "",
      alias: "",
      pageType: "CalculatedSummaryPage",
      position: 2,
      displayName: "Foo",
      totalTitle: "",
      section: {
        id: "1",
        displayName: "This Section",
        questionnaire: { id: "1", metadata: [] },
      },
      summaryAnswers: [],
    };
    questionnaire.sections[0].folders[0].pages.push(page);
    answers = [
      {
        id: 1,
        displayName: "Answer 1",
        type: NUMBER,
        properties: {},
      },
      {
        id: 2,
        displayName: "Answer 2",
        type: NUMBER,
        properties: {},
      },
      {
        id: 3,
        displayName: "Answer 3",
        type: NUMBER,
        properties: {},
      },
    ];
    questionnaire.sections[0].folders[0].pages[0].answers = answers;
    useQuestionnaire.mockImplementation(() => ({ questionnaire }));
  });

  it("should render when there are no available summary answers", () => {
    page.id = "1.1.1";
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when there are available summary answers", () => {
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a list of AnswerChips when answers selected", () => {
    page.summaryAnswers = answers;
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper.find(AnswerChip)).toHaveLength(3);
  });

  it("should render an error when incompatible units selected", () => {
    mockHandlers.getValidationError = jest.fn(
      () => "Select answers that are the same unit type"
    );
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper.find(ErrorContext)).toBeTruthy();
  });

  it("should remove single answers on remove click", () => {
    page.summaryAnswers = answers;
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper.find(AnswerChip)).toHaveLength(3);
    wrapper.find(AnswerChip).first().simulate("remove");
    expect(mockHandlers.onUpdateCalculatedSummaryPage).toHaveBeenCalledWith({
      id: "2",
      summaryAnswers: [answers[1], answers[2]],
    });
  });

  it("should remove multiple answers on removeAll click", () => {
    page.summaryAnswers = answers;
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper.find(AnswerChip)).toHaveLength(3);
    wrapper.find('[data-test="remove-all"]').simulate("click");
    expect(mockHandlers.onUpdateCalculatedSummaryPage).toHaveBeenCalledWith({
      id: "2",
      summaryAnswers: [],
    });
  });
});
