import React from "react";
import { mount, shallow } from "enzyme";
import QuestionPageRoute, {
  UnwrappedQuestionPageRoute,
  QUESTION_PAGE_QUERY,
} from "./";
import TestProvider from "tests/utils/TestProvider";
import { buildPagePath } from "utils/UrlUtils";
import flushPromises from "tests/utils/flushPromises";
import createRouterContext from "react-router-test-context";
import PropTypes from "prop-types";

import movePageQuery from "graphql/getQuestionnaire.graphql";

describe("QuestionPageRoute", () => {
  let store,
    match,
    context,
    childContextTypes,
    mockHandlers,
    questionnaireId,
    sectionId,
    pageId,
    movePageMock;

  beforeEach(() => {
    childContextTypes = { router: PropTypes.object };

    questionnaireId = "1";
    sectionId = "2";
    pageId = "3";

    movePageMock = {
      request: {
        query: movePageQuery,
        variables: {
          input: { questionnaireId },
        },
      },
      result: {
        data: {
          questionnaire: {
            id: questionnaireId,
            title: "",
            description: "",
            surveyId: "1",
            theme: "foo",
            legalBasis: "",
            navigation: true,
            summary: "",
            __typename: "Questionnaire",
            sections: [
              {
                __typename: "Section",
                id: sectionId,
                title: "foo",
                displayName: "foo",
                position: 0,
                pages: [
                  {
                    __typename: "QuestionPage",
                    id: pageId,
                    title: "bar",
                    alias: "bar-alias",
                    displayName: "bar",
                    position: 0,
                    definitionLabel: "definition label",
                    definitionContent: "definitionContent",
                    additionalInfoLabel: "additional info label",
                    additionalInfoContent: "additional info content",
                    section: {
                      __typename: "Section",
                      questionnaire: {
                        __typename: "Questionnaire",
                        metadata: [],
                      },
                    },
                  },
                  {
                    __typename: "QuestionPage",
                    id: "4",
                    title: "blah",
                    alias: "blah-alias",
                    displayName: "blah",
                    position: 1,
                    definitionLabel: "definition label",
                    definitionContent: "definitionContent",
                    additionalInfoLabel: "additional info label",
                    additionalInfoContent: "additional info content",
                    section: {
                      __typename: "Section",
                      questionnaire: {
                        __typename: "Questionnaire",
                        metadata: [],
                      },
                    },
                  },
                ],
                questionnaire: {
                  __typename: "Questionnaire",
                  id: questionnaireId,
                  questionnaireInfo: {
                    __typename: "QuestionnaireInfo",
                    totalSectionCount: 1,
                  },
                },
              },
            ],
          },
        },
      },
    };

    match = {
      params: { questionnaireId, sectionId, pageId },
    };

    store = {
      getState: jest.fn(() => ({
        toasts: {},
        saving: { apiDownError: false },
      })),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };

    context = createRouterContext({
      location: { pathname: buildPagePath(match.params) },
      match,
    });

    mockHandlers = {
      onMovePage: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePage: jest.fn(),
      onAddPage: jest.fn(),
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
    const render = (mocks, Component = QuestionPageRoute, props = {}) =>
      mount(
        <TestProvider reduxProps={{ store }} apolloProps={{ mocks }}>
          <Component match={match} {...props} />
        </TestProvider>,
        { context, childContextTypes }
      );

    it("should show loading spinner while request in flight", () => {
      const mock = {
        request: {
          query: QUESTION_PAGE_QUERY,
          variables: {
            input: {
              questionnaireId,
              sectionId,
              pageId,
            },
          },
        },
        result: {
          data: {
            questionPage: {
              __typename: "QuestionPage",
              id: pageId,
              title: "foo",
              alias: "foo-alias",
              displayName: "foo",
              description: "bar",
              pageType: "QuestionPage",
              position: 0,
              definitionLabel: "definition label",
              definitionContent: "definitionContent",
              additionalInfoLabel: "additional info label",
              additionalInfoContent: "additional info content",
              guidance: "",
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
            },
          },
        },
      };

      const wrapper = render([mock, movePageMock]);

      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(true);
      expect(wrapper.find(`[data-test="question-page-editor"]`).exists()).toBe(
        false
      );
    });

    it("should render the editor once loaded", () => {
      const mock = {
        request: {
          query: QUESTION_PAGE_QUERY,
          variables: {
            input: {
              questionnaireId,
              sectionId,
              pageId,
            },
          },
        },
        result: {
          data: {
            questionPage: {
              __typename: "QuestionPage",
              id: pageId,
              title: "foo",
              alias: "foo-alias",
              displayName: "foo",
              description: "bar",
              pageType: "QuestionPage",
              position: 0,
              definitionLabel: "definition label",
              definitionContent: "definitionContent",
              additionalInfoLabel: "additional info label",
              additionalInfoContent: "additional info content",
              guidance: "",
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
            },
          },
        },
      };

      const wrapper = render([mock, mock, movePageMock, movePageMock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(
          wrapper.find(`[data-test="question-page-editor"]`).exists()
        ).toBe(true);
      });
    });

    it("should render error if problem with request", () => {
      const mock = {
        request: {
          query: QUESTION_PAGE_QUERY,
          variables: {
            id: pageId,
          },
        },
        error: new Error("oops"),
      };

      const wrapper = shallow(
        <UnwrappedQuestionPageRoute
          data={mock}
          error={new Error("oops")}
          loading={false}
          match={match}
          {...mockHandlers}
        />
      );

      // for some reason, mounting didn't work for this test, so i had to shallow instead :(
      expect(wrapper.find("Error").exists()).toBe(true);
    });

    it("should render error if no page returned", () => {
      const mock = {
        request: {
          query: QUESTION_PAGE_QUERY,
          variables: {
            input: {
              questionnaireId,
              sectionId,
              pageId,
            },
          },
        },
        result: {
          data: {
            questionPage: null,
          },
        },
      };

      const wrapper = render([mock, mock, movePageMock, movePageMock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(
          wrapper.find(`[data-test="question-page-editor"]`).exists()
        ).toBe(false);
        expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
      });
    });
  });

  describe("behaviour", () => {
    const page = {
      __typename: "QuestionPage",
      id: pageId,
      title: "foo",
      alias: "foo-alias",
      displayName: "foo",
      description: "bar",
      pageType: "QuestionPage",
      position: 0,
      definitionLabel: "definition label",
      definitionContent: "definitionContent",
      additionalInfoLabel: "additional info label",
      additionalInfoContent: "additional info content",
      guidance: "",
      answers: [],
      section: {
        id: sectionId,
        __typename: "Section",
        questionnaire: {
          id: questionnaireId,
          __typename: "Questionnaire",
          metadata: [],
        },
      },
    };
    const render = (props = {}, renderer = mount) =>
      renderer(
        <TestProvider
          reduxProps={{ store }}
          apolloProps={{ mocks: [movePageMock] }}
        >
          <UnwrappedQuestionPageRoute {...props} />
        </TestProvider>,
        { context, childContextTypes }
      );

    it("ensures confirmation before delete", () => {
      const wrapper = render({
        loading: false,
        match,
        page,
        ...mockHandlers,
      });

      wrapper
        .find(`[data-test="btn-delete"]`)
        .first()
        .simulate("click");

      wrapper
        .find(`[data-test="btn-delete-modal"]`)
        .first()
        .simulate("click");

      expect(mockHandlers.onDeletePage).toHaveBeenCalledWith(sectionId, pageId);
    });

    it("should allow answers to be added", () => {
      const onAddAnswer = jest.fn(() => Promise.resolve(() => ({ id: "1" })));
      const wrapper = render(
        {
          loading: false,
          match,
          page,
          ...mockHandlers,
          onAddAnswer,
        },
        mount
      );

      wrapper
        .find(`[data-test="btn-add-answer"]`)
        .first()
        .simulate("click");

      wrapper
        .find(`button[title="Radio"]`)
        .first()
        .simulate("click");

      expect(onAddAnswer).toHaveBeenCalledWith(pageId, "Radio");
    });

    it("should call onDuplicatePage prop with correct arguments", () => {
      const wrapper = render(
        {
          loading: false,
          match,
          page,
          ...mockHandlers,
        },
        mount
      );

      wrapper
        .find(`[data-test="btn-duplicate-page"]`)
        .first()
        .simulate("click");

      expect(mockHandlers.onDuplicatePage).toHaveBeenCalledWith({
        sectionId: match.params.sectionId,
        pageId: page.id,
        position: parseInt(page.position, 10) + 1,
      });
    });
  });
});
