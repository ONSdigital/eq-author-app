import React from "react";
import { shallow } from "enzyme";
import { UnwrappedPageRoute } from "./";
import Loading from "components/Loading";
import QuestionPageEditor from "./QuestionPageEditor";
import CalculatedSummaryPageEditor from "./CalculatedSummaryPageEditor";

describe("PageRoute", () => {
  let match, mockHandlers, questionnaireId, sectionId, pageId;

  beforeEach(() => {
    questionnaireId = "1";
    sectionId = "2";
    pageId = "3";

    match = {
      params: { questionnaireId, sectionId, pageId },
    };

    mockHandlers = {
      onMovePage: jest.fn(),
      onUpdateQuestionPage: jest.fn(),
      onDeletePage: jest.fn(),
      onAddQuestionPage: jest.fn(),
      onAddExclusive: jest.fn(),
      onUpdateAnswer: jest.fn(),
      onAddAnswer: jest.fn(),
      onDeleteAnswer: jest.fn(),
      onAddOption: jest.fn(),
      onUpdateOption: jest.fn(),
      onDeleteOption: jest.fn(),
      onAddOther: jest.fn(),
      onDeleteOther: jest.fn(),
      onDuplicatePage: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };
  });

  describe("data fetching", () => {
    const render = props =>
      shallow(
        <UnwrappedPageRoute match={match} {...mockHandlers} {...props} />
      );

    it("should show loading spinner while request in flight", () => {
      const wrapper = render({ loading: true });
      expect(wrapper.find(Loading).exists()).toBe(true);
      expect(wrapper.find(`[data-test="question-page-editor"]`).exists()).toBe(
        false
      );
    });

    it("should render a questionPage editor once loaded", () => {
      const page = {
        __typename: "QuestionPage",
        id: pageId,
        title: "foo",
        alias: "foo-alias",
        pageType: "QuestionPage",
        displayName: "foo",
        description: "bar",
        descriptionEnabled: true,
        position: 0,
        definitionLabel: "definition label",
        definitionContent: "definitionContent",
        definitionEnabled: true,
        additionalInfoLabel: "additional info label",
        additionalInfoContent: "additional info content",
        additionalInfoEnabled: true,
        guidance: "",
        guidanceEnabled: true,
        answers: [],
        section: {
          __typename: "Section",
          id: sectionId,
          questionnaire: {
            __typename: "Questionnaire",
            id: questionnaireId,
            metadata: [],
          },
        },
        validationErrorInfo: {
          totalCount: 1,
          errors: [{ id: "design-1" }],
        },
      };

      const wrapper = render({ loading: false, page });

      expect(wrapper.find(Loading).exists()).toBe(false);
      expect(wrapper.find(QuestionPageEditor).exists()).toBe(true);
    });

    it("should render a calculatedSummaryPage editor once loaded", () => {
      const page = {
        __typename: "CalculatedSummaryPage",
        id: pageId,
        title: "foo",
        alias: "foo-alias",
        pageType: "CalculatedSummaryPage",
        displayName: "foo-alias",
        position: 0,
        section: {
          __typename: "Section",
          id: sectionId,
          questionnaire: {
            __typename: "Questionnaire",
            id: questionnaireId,
            metadata: [],
          },
        },
      };

      const wrapper = render({ loading: false, page });

      expect(wrapper.find(Loading).exists()).toBe(false);
      expect(wrapper.find(CalculatedSummaryPageEditor).exists()).toBe(true);
    });

    it("should render error if problem with request", () => {
      const wrapper = render({
        loading: false,
        page: null,
        error: new Error("HELP"),
      });
      expect(wrapper.find("Error").exists()).toBe(true);
    });

    it("should render error if no page returned", () => {
      const wrapper = render({
        loading: false,
        page: null,
      });
      expect(wrapper.find("Error").exists()).toBe(true);
    });

    it("should add new question page to correct section", () => {
      const page = {
        id: "1",
        displayName: "Foo",
        answers: [],
        position: 1,
        section: {
          id: 1,
        },
        folder: {
          id: 10,
          position: 0,
        },
        pageType: "QuestionPage",
      };

      const wrapper = render({
        loading: false,
        page,
      });

      wrapper.simulate("addQuestionPage");

      expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
        page.section.id,
        page.folder.position + 1
      );
    });
  });
});
