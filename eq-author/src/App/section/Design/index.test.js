import React from "react";
import { mount } from "enzyme";
import PropTypes from "prop-types";

import TestProvider from "tests/utils/TestProvider";
import { buildSectionPath } from "utils/UrlUtils";
import flushPromises from "tests/utils/flushPromises";
import createRouterContext from "react-router-test-context";
import { byTestAttr } from "tests/utils/selectors";
import { MeContext } from "App/MeContext";

import GET_QUESTIONNAIRE_QUERY from "graphql/getQuestionnaire.graphql";

import { WRITE } from "constants/questionnaire-permissions";

import SectionRoute, { UnwrappedSectionRoute, SECTION_QUERY } from "./";

const questionnaireId = "1";
const sectionId = "2";

const moveSectionMock = {
  request: {
    query: GET_QUESTIONNAIRE_QUERY,
    variables: {
      input: {
        questionnaireId,
      },
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
        type: "Social",
        navigation: true,
        summary: "",
        displayName: "Display name",
        shortTitle: "Short tile",
        permission: WRITE,
        isPublic: true,
        createdBy: {
          id: "1",
          name: "Some user",
          email: "some@user.com",
          picture: "some.jpg",
          __typename: "User",
        },
        editors: [],
        __typename: "Questionnaire",
        sections: [
          {
            __typename: "Section",
            id: sectionId,
            title: "foo",
            alias: "foo-alias",
            introductionTitle: "",
            introductionContent: "",
            displayName: "foo",
            position: 0,
            pages: [
              {
                __typename: "QuestionPage",
                id: "3",
                title: "bar",
                alias: "bar alias",
                displayName: "bar",
                position: 0,
              },
              {
                __typename: "QuestionPage",
                id: "4",
                title: "blah",
                alias: "blah alias",
                displayName: "blah",
                position: 1,
              },
            ],
            questionnaire: {
              __typename: "Questionnaire",
              id: questionnaireId,
              navigation: true,
              questionnaireInfo: {
                __typename: "QuestionnaireInfo",
                totalSectionCount: 1,
              },
            },
            validationErrorInfo: {
              totalCount: 0,
              errors: [],
              __typename: "ValidationErrorInfo",
            },
          },
          {
            __typename: "Section",
            id: "3",
            title: "foo",
            alias: "foo-alias",
            displayName: "foo",
            introductionTitle: "",
            introductionContent: "",
            position: 1,
            pages: [
              {
                __typename: "QuestionPage",
                id: "5",
                title: "bar",
                alias: "bar alias",
                displayName: "bar",
                position: 0,
              },
              {
                __typename: "QuestionPage",
                id: "6",
                title: "blah",
                alias: "blah alias",
                displayName: "blah",
                position: 1,
              },
            ],
            questionnaire: {
              __typename: "Questionnaire",
              id: questionnaireId,
              navigation: true,
              questionnaireInfo: {
                __typename: "QuestionnaireInfo",
                totalSectionCount: 1,
              },
            },
            validationErrorInfo: {
              totalCount: 0,
              errors: [],
              __typename: "ValidationErrorInfo",
            },
          },
        ],
      },
    },
  },
};

describe("SectionRoute", () => {
  let store, match, context, childContextTypes, user;

  beforeEach(() => {
    childContextTypes = { router: PropTypes.object };
    const toasts = document.createElement("div");
    toasts.setAttribute("id", "toast");
    document.body.appendChild(toasts);

    user = {
      id: "123",
      name: "Test McTest",
      email: "McTest@test.com",
    };

    match = {
      params: { questionnaireId, sectionId },
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
      location: { pathname: buildSectionPath(match.params) },
      match,
    });
  });

  describe("data fetching", () => {
    const render = mocks =>
      mount(
        <MeContext.Provider value={{ me: user }}>
          <TestProvider reduxProps={{ store }} apolloProps={{ mocks }}>
            <SectionRoute match={match} />
          </TestProvider>
        </MeContext.Provider>,
        { context, childContextTypes }
      );

    it("should show loading spinner while request in flight", () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: { input: { questionnaireId, sectionId } },
        },
        result: {
          data: {
            section: {
              __typename: "Section",
              id: sectionId,
              title: "foo",
              alias: "foo-alias",
              displayName: "foo",
              description: "bar",
              introductionTitle: "",
              introductionContent: "",
              position: 0,
              questionnaire: {
                __typename: "Questionnaire",
                id: questionnaireId,
                navigation: true,
                questionnaireInfo: {
                  __typename: "QuestionnaireInfo",
                  totalSectionCount: 1,
                },
              },
              validationErrorInfo: {
                totalCount: 0,
                errors: [],
                __typename: "ValidationErrorInfo",
              },
            },
          },
        },
      };
      const wrapper = render([mock, moveSectionMock]);
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(true);
      expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(false);

      return flushPromises().then(() => {
        wrapper.update();
      });
    });

    it("should render the editor once loaded", () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: { input: { questionnaireId, sectionId } },
        },
        result: {
          data: {
            section: {
              __typename: "Section",
              id: sectionId,
              title: "foo",
              alias: "foo-alias",
              displayName: "foo",
              description: "bar",
              introductionTitle: "",
              introductionContent: "",
              position: 0,
              questionnaire: {
                __typename: "Questionnaire",
                id: "1",
                navigation: true,
                questionnaireInfo: {
                  __typename: "QuestionnaireInfo",
                  totalSectionCount: 1,
                },
              },
              validationErrorInfo: {
                totalCount: 0,
                errors: [],
                __typename: "ValidationErrorInfo",
              },
            },
          },
        },
      };

      const wrapper = render([mock, mock, moveSectionMock, moveSectionMock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(
          true
        );
      });
    });

    it("should render error if problem with request", () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: { input: { questionnaireId: "1", sectionId: "2" } },
        },
        error: new Error("something went wrong"),
      };

      const wrapper = render([mock]);

      return flushPromises()
        .then(flushPromises)
        .then(() => {
          wrapper.update();
          expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
          expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(
            false
          );
          expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
        });
    });

    it("should render error if no section returned", () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: { input: { questionnaireId: "1", sectionId: "2" } },
        },
        result: {
          data: null,
        },
      };

      const wrapper = render([mock]);

      return flushPromises().then(() => {
        wrapper.update();
        expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
        expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(
          false
        );
        expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
      });
    });
  });

  describe("behaviour", () => {
    const mockHandlers = {
      onUpdateSection: jest.fn(),
      onDeleteSection: jest.fn(),
      onDuplicateSection: jest.fn(),
      onAddQuestionPage: jest.fn(),
      onMoveSection: jest.fn(),
      onUpdate: jest.fn(),
      onChange: jest.fn(),
    };

    const section = {
      id: "1",
      title: "foo",
      alias: "foo alias",
      description: "bar",
      introduction: null,
      position: 0,
      introductionTitle: "",
      introductionContent: "",
      questionnaire: {
        id: "1",
        navigation: true,
        questionnaireInfo: {
          totalSectionCount: 1,
        },
      },
      validationErrorInfo: {
        totalCount: 0,
        errors: [],
        __typename: "ValidationErrorInfo",
      },
    };

    const render = (props = {}) =>
      mount(
        <MeContext.Provider value={{ me: user }}>
          <TestProvider
            reduxProps={{ store }}
            apolloProps={{ mocks: [moveSectionMock] }}
          >
            <UnwrappedSectionRoute {...props} />
          </TestProvider>
        </MeContext.Provider>,
        { context, childContextTypes }
      );

    it("ensures confirmation before delete", () => {
      const wrapper = render({
        loading: false,
        match,
        section,
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

      expect(mockHandlers.onDeleteSection).toHaveBeenCalledWith(sectionId);
    });

    it("allows new pages to be added", () => {
      const wrapper = render({
        loading: false,
        match,
        section,
        ...mockHandlers,
      });

      wrapper
        .find(`[data-test="btn-add-page"]`)
        .first()
        .simulate("click");

      expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
        match.params.sectionId,
        0
      );
    });

    it("should disable move section button when one section", () => {
      const wrapper = render({
        loading: false,
        match,
        section,
        ...mockHandlers,
      });

      expect(
        wrapper.find(`Button${byTestAttr("btn-move")}`).prop("disabled")
      ).toBe(true);
    });

    it("should enable move section button when multiple sections", () => {
      const questionnaire = {
        id: "1",
        navigation: true,
        questionnaireInfo: {
          totalSectionCount: 2,
        },
      };

      const wrapper = render({
        loading: false,
        match,
        section: { ...section, questionnaire },
        ...mockHandlers,
      });

      expect(
        wrapper.find(`Button${byTestAttr("btn-move")}`).prop("disabled")
      ).toBe(false);
    });

    it("should call onDuplicateSection with the section id and position when the duplicate button is clicked", () => {
      const questionnaire = {
        id: "1",
        navigation: true,
        questionnaireInfo: {
          totalSectionCount: 2,
        },
      };

      const wrapper = render({
        loading: false,
        match,
        section: { ...section, questionnaire },
        ...mockHandlers,
      });

      wrapper
        .find(`Button${byTestAttr("btn-duplicate-section")}`)
        .simulate("click");

      expect(mockHandlers.onDuplicateSection).toHaveBeenCalledWith({
        sectionId: section.id,
        position: section.position + 1,
      });
    });

    it("should disable the preview tab when the introduction is disabled", () => {
      const wrapper = render({
        loading: false,
        match,
        section,
        ...mockHandlers,
      });

      const editorLayout = wrapper.find(
        `EditorLayout${byTestAttr("section-route")}`
      );

      expect(editorLayout.props()).toMatchObject({
        preview: false,
      });
    });

    it("should enable the preview tab when the introduction is enabled", () => {
      const wrapper = render({
        loading: false,
        match,
        section: {
          ...section,
          introductionTitle: "Title",
          introductionContent: "Content",
        },
        ...mockHandlers,
      });

      const editorLayout = wrapper.find(
        `EditorLayout${byTestAttr("section-route")}`
      );

      expect(editorLayout.props()).toMatchObject({
        preview: true,
      });
    });
  });
});
