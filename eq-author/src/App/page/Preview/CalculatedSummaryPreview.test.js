import React from "react";
import { shallow } from "enzyme";

import { byTestAttr } from "tests/utils/selectors";

import CalculatedSummaryPreview from "./CalculatedSummaryPreview";

describe("CalculatedSummaryPreview", () => {
  let page;
  beforeEach(() => {
    page = {
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      totalTitle: "<p>Total be:</p>",
      alias: "Who am I?",
      summaryAnswers: [
        { id: "1", displayName: "Answer 1" },
        { id: "2", displayName: "Answer 2" },
        { id: "3", displayName: "Answer 3" },
      ],
      pageType: "CalculatedSummaryPage",
      section: {
        id: "1",
        questionnaire: {
          id: "1",
          metadata: [],
        },
      },
      validationErrorInfo: [],
    };
  });

  it("should render", () => {
    const wrapper = shallow(<CalculatedSummaryPreview page={page} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render empty box when no total-title given", () => {
    page.totalTitle = "";
    const wrapper = shallow(<CalculatedSummaryPreview page={page} />);
    expect(wrapper.find(byTestAttr("no-total-title"))).toBeTruthy();
  });

  it("should render 'no answers selected' message", () => {
    page.summaryAnswers = [];
    const wrapper = shallow(<CalculatedSummaryPreview page={page} />);
    expect(wrapper.find(byTestAttr("no-answers-selected"))).toBeTruthy();
  });
});
