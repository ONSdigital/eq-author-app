import React from "react";
import { mount } from "enzyme";
import SectionRoute, { UnwrappedSectionRoute, SECTION_QUERY } from "./";

import TestProvider from "tests/utils/TestProvider";
import { buildSectionPath } from "utils/UrlUtils";
import flushPromises from "tests/utils/flushPromises";
import createRouterContext from "react-router-test-context";
import PropTypes from "prop-types";
import { byTestAttr } from "tests/utils/selectors";
import fakeId from "tests/utils/fakeId";

import GET_QUESTIONNAIRE_QUERY from "graphql/getQuestionnaire.graphql";

const questionnaireId = fakeId("1");
const sectionId = fakeId("2");

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
        legalBasis: "",
        navigation: true,
        summary: "",
        __typename: "Questionnaire",
        sections: [
          {
            __typename: "Section",
            id: sectionId,
            title: "foo",
            alias: "foo-alias",
            introduction: null,
            displayName: "foo",
            position: 0,
            pages: [
              {
                __typename: "QuestionPage",
                id: fakeId("3"),
                title: "bar",
                alias: "bar alias",
                displayName: "bar",
                position: 0,
              },
              {
                __typename: "QuestionPage",
                id: fakeId("4"),
                title: "blah",
                alias: "blah alias",
                displayName: "blah",
                position: 1,
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
          {
            __typename: "Section",
            id: fakeId("3"),
            title: "foo",
            alias: "foo-alias",
            displayName: "foo",
            introductionTitle: null,
            introductionContent: null,
            introductionEnabled: false,
            position: 1,
            pages: [
              {
                __typename: "QuestionPage",
                id: fakeId("5"),
                title: "bar",
                alias: "bar alias",
                displayName: "bar",
                position: 0,
              },
              {
                __typename: "QuestionPage",
                id: fakeId("6"),
                title: "blah",
                alias: "blah alias",
                displayName: "blah",
                position: 1,
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

describe("SectionRoute", () => {
  let store, match, context, childContextTypes;

  beforeEach(() => {
    childContextTypes = { router: PropTypes.object };

    match = {
      params: { questionnaireId: questionnaireId, sectionId },
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
        <TestProvider reduxProps={{ store }} apolloProps={{ mocks }}>
          <SectionRoute match={match} />
        </TestProvider>,
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
              introduction: null,
              position: 0,
              questionnaire: {
                __typename: "Questionnaire",
                id: questionnaireId,
                questionnaireInfo: {
                  __typename: "QuestionnaireInfo",
                  totalSectionCount: 1,
                },
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
              introduction: null,
              position: 0,
              questionnaire: {
                __typename: "Questionnaire",
                id: "1",
                questionnaireInfo: {
                  __typename: "QuestionnaireInfo",
                  totalSectionCount: 1,
                },
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
      onAddPage: jest.fn(),
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
      questionnaire: {
        id: "1",
        questionnaireInfo: {
          totalSectionCount: 1,
        },
      },
    };

    const render = (props = {}) =>
      mount(
        <TestProvider
          reduxProps={{ store }}
          apolloProps={{ mocks: [moveSectionMock] }}
        >
          <UnwrappedSectionRoute {...props} />
        </TestProvider>,
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

      expect(mockHandlers.onAddPage).toHaveBeenCalledWith(
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
          introduction: {
            id: "2",
            introductionTitle: "",
            introductionContent: "",
          },
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
