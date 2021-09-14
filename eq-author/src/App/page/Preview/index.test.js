import React from "react";
import { shallow } from "enzyme";

import { UnwrappedPreviewPageRoute as PreviewPageRoute } from "./";

import Loading from "components/Loading";
import CalculatedSummaryPreview from "./CalculatedSummaryPreview";
import QuestionPagePreview from "./QuestionPagePreview";

describe("page previews", () => {
  let page;
  const render = (props) => shallow(<PreviewPageRoute {...props} />);

  it("should show loading spinner while request in flight", () => {
    const wrapper = render({ loading: true });
    expect(wrapper.find(Loading).exists()).toBe(true);
    expect(wrapper.find(QuestionPagePreview).exists()).toBe(false);
  });

  it("should render a questionPagePreview", () => {
    page = {
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      alias: "Who am I?",
      pageType: "QuestionPage",
      description: "<p>Description</p>",
      descriptionEnabled: true,
      guidance: "<p>Guidance</p>",
      guidanceEnabled: true,
      definitionLabel: "<p>Definition Label</p>",
      definitionContent: "<p>Definition Content</p>",
      definitionEnabled: true,
      additionalInfoLabel: "<p>Additional Info Label</p>",
      additionalInfoContent: "<p>Additional Info Content</p>",
      additionalInfoEnabled: true,
      validationErrorInfo: [],
      answers: [],
      folder: {
        id: "1",
        position: "1",
      },
      section: {
        id: "1",
        position: "1",
        questionnaire: {
          id: "1",
          metadata: [],
        },
      },
      totalValidation: null,
    };

    const wrapper = render({
      loading: false,
      data: { page },
    });
    expect(wrapper.find(Loading).exists()).toBe(false);
    expect(wrapper.find(QuestionPagePreview).exists()).toBe(true);
  });

  it("should render a calculatedSummaryPagePreview", () => {
    page = {
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      alias: "Who am I?",
      pageType: "CalculatedSummaryPage",
      totalTitle: "GrandTotal",
      folder: {
        id: "1",
        position: "1",
      },
      section: {
        id: "1",
        position: "1",
        questionnaire: {
          id: "1",
          metadata: [],
        },
      },
      validationErrorInfo: [],
    };

    const wrapper = render({
      loading: false,
      data: { page },
    });
    expect(wrapper.find(Loading).exists()).toBe(false);
    expect(wrapper.find(CalculatedSummaryPreview).exists()).toBe(true);
  });
});
