import React from "react";
import { shallow } from "enzyme";

import { NUMBER } from "constants/answer-types";

import {
  UnwrappedAnswerSelector as AnswerSelector,
  ErrorContext,
} from "./AnswerSelector";
import AnswerChip from "./AnswerChip";

describe("AnswerSelector", () => {
  let mockHandlers, page, answers;
  beforeEach(() => {
    mockHandlers = {
      fetchAnswers: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      onChangeUpdate: jest.fn(),
      onUpdateCalculatedSummaryPage: jest.fn(),
      getValidationError: jest.fn(),
    };
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
      availableSummaryAnswers: [],
    };
    answers = [
      {
        id: 1,
        displayName: "Answer 1",
        type: NUMBER,
        properties: {},
        page: {
          id: "1",
          displayName: "Foo",
          section: { id: 1, displayName: "Section 1" },
        },
      },
      {
        id: 2,
        displayName: "Answer 2",
        type: NUMBER,
        properties: {},
        page: {
          id: "1",
          displayName: "Foo",
          section: { id: 1, displayName: "Section 1" },
        },
      },
      {
        id: 3,
        displayName: "Answer 3",
        type: NUMBER,
        properties: {},
        page: {
          id: "1",
          displayName: "Foo",
          section: { id: 1, displayName: "Section 1" },
        },
      },
    ];
  });

  it("should render when there are no available summary answers", () => {
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when there are available summary answers", () => {
    page.availableSummaryAnswers = answers;
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
    wrapper
      .find(AnswerChip)
      .first()
      .simulate("remove");
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
