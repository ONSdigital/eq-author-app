import React from "react";
import { shallow } from "enzyme";

import { NUMBER } from "constants/answer-types";
import ContentPickerModal from "components/ContentPickerModal";

import AnswerSelector, { SuggestionButton } from "./AnswerSelector";
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
    };
    page = {
      id: "2",
      title: "",
      alias: "",
      pageType: "CalculatedSummaryPage",
      position: 2,
      displayName: "Foo",
      totalTitle: "",
      section: { id: "1", displayName: "This Section" },
      summaryAnswers: [],
      availableSummaryAnswers: [],
    };
    answers = [
      {
        id: 1,
        displayName: "Answer 1",
        type: NUMBER,
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
        page: {
          id: "1",
          displayName: "Foo",
          section: { id: 1, displayName: "Section 1" },
        },
      },
    ];
  });

  it("should render", () => {
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a list of AnswerChips when answers selected", () => {
    page.summaryAnswers = answers;
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper.find(AnswerChip)).toHaveLength(3);
  });

  it("can add a single answer", () => {
    page.availableSummaryAnswers = answers;
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    wrapper.find(ContentPickerModal).simulate("submit", { value: { id: 1 } });
    expect(mockHandlers.onUpdateCalculatedSummaryPage).toHaveBeenCalledWith({
      id: "2",
      summaryAnswers: [{ value: { id: 1 } }],
    });
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

  it("should add many answers when a suggestion is selected", () => {
    page.availableSummaryAnswers = answers;
    const wrapper = shallow(<AnswerSelector page={page} {...mockHandlers} />);
    expect(wrapper.find(SuggestionButton)).toHaveLength(1);
    wrapper.find(SuggestionButton).simulate("click");
    expect(mockHandlers.onUpdateCalculatedSummaryPage).toHaveBeenCalledWith({
      id: "2",
      summaryAnswers: [
        expect.objectContaining({
          displayName: "Answer 1",
          id: 1,
          type: NUMBER,
        }),
        expect.objectContaining({
          displayName: "Answer 2",
          id: 2,
          type: NUMBER,
        }),
        expect.objectContaining({
          displayName: "Answer 3",
          id: 3,
          type: NUMBER,
        }),
      ],
    });
  });
});
