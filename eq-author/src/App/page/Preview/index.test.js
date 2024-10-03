import React from "react";
import { shallow } from "enzyme";

import { UnwrappedPreviewPageRoute as PreviewPageRoute } from "./";

import Loading from "components/Loading";
import CalculatedSummaryPreview from "./CalculatedSummaryPreview";
import QuestionPagePreview from "./QuestionPagePreview";
import ListCollectorQualifierPagePreview from "./ListCollectorPagePreviews/QualifierPagePreview";
import ListCollectorAddItemPagePreview from "./ListCollectorPagePreviews/AddItemPagePreview";
import ListCollectorConfirmationPagePreview from "./ListCollectorPagePreviews/ConfirmationPagePreview";

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
      pageDescription: "Question",
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
      confirmation: {
        id: "confirmation-1",
      },
      validationErrorInfo: [],
      comments: [],
      answers: [],
      folder: {
        id: "1",
        position: "1",
      },
      section: {
        id: "1",
        position: "1",
        repeatingSection: false,
        repeatingSectionListId: null,
        allowRepeatingSection: false,
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
      pageDescription: "Calculated summary",
      alias: "Who am I?",
      pageType: "CalculatedSummaryPage",
      totalTitle: "GrandTotal",
      type: null,
      answers: [],
      comments: [],
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

  it("should render list collector qualifier page preview", () => {
    page = {
      id: "1",
      pageType: "ListCollectorQualifierPage",
      title: "<p>Hello world</p>",
      pageDescription: "List collector qualifier",
      additionalGuidanceEnabled: false,
      additionalGuidanceContent: "",
      position: 0,
      answers: [
        {
          id: "answer-1",
          type: "Radio",
          options: [
            {
              id: "option-1",
              label: "Yes",
            },
            {
              id: "option-2",
              label: "No",
            },
          ],
        },
      ],
    };

    const wrapper = render({
      loading: false,
      data: { page },
    });
    expect(wrapper.find(Loading).exists()).toBe(false);
    expect(wrapper.find(ListCollectorQualifierPagePreview).exists()).toBe(true);
  });

  it("should render list collector add item page preview", () => {
    page = {
      id: "1",
      pageType: "ListCollectorAddItemPage",
      title: "<p>Hello world</p>",
      pageDescription: "List collector add item",
      position: 1,
    };

    const wrapper = render({
      loading: false,
      data: { page },
    });
    expect(wrapper.find(Loading).exists()).toBe(false);
    expect(wrapper.find(ListCollectorAddItemPagePreview).exists()).toBe(true);
  });

  it("should render list collector confirmation page preview", () => {
    page = {
      id: "1",
      pageType: "ListCollectorConfirmationPage",
      title: "<p>Hello world</p>",
      pageDescription: "List collector confirmation",
      position: 2,
      answers: [
        {
          id: "answer-1",
          type: "Radio",
          options: [
            {
              id: "option-1",
              label: "Yes",
            },
            {
              id: "option-2",
              label: "No",
            },
          ],
        },
      ],
    };

    const wrapper = render({
      loading: false,
      data: { page },
    });
    expect(wrapper.find(Loading).exists()).toBe(false);
    expect(wrapper.find(ListCollectorConfirmationPagePreview).exists()).toBe(
      true
    );
  });
});
