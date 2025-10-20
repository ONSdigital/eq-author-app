import React from "react";
import { mount } from "enzyme";
import PropTypes from "prop-types";
import { act } from "react-dom/test-utils";

import { Router, Route } from "react-router-dom";
import { createMemoryHistory } from "history";
import TestProvider from "tests/utils/TestProvider";
import { buildSectionPath } from "utils/UrlUtils";
import flushPromises from "tests/utils/flushPromises";
import createRouterContext from "react-router-test-context";
import { byTestAttr } from "tests/utils/selectors";
import { MeContext } from "App/MeContext";

import { publishStatusSubscription } from "components/EditorLayout/Header";

import SectionRoute, { UnwrappedSectionRoute, SECTION_QUERY } from "./";
import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage("componentWillMount has been renamed", "warn");
suppressConsoleMessage("componentWillReceiveProps has been renamed", "warn");

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);

const questionnaireId = "1";
const sectionId = "2";

const section = {
  __typename: "Section",
  id: sectionId,
  title: "foo",
  alias: "foo-alias",
  introductionEnabled: false,
  introductionTitle: "",
  introductionContent: "",
  introductionPageDescription: "",
  displayName: "foo",
  position: 0,
  requiredCompleted: false,
  showOnHub: false,
  sectionSummary: false,
  sectionSummaryPageDescription: "",
  collapsibleSummary: false,
  repeatingSection: false,
  allowRepeatingSection: false,
  repeatingSectionListId: null,
  comments: [],
  folders: [
    {
      __typename: "Folder",
      id: "folder-1",
      alias: "",
      displayName: "",
      enabled: false,
      position: 0,
      pages: [
        {
          __typename: "QuestionPage",
          id: "3",
          title: "bar",
          alias: "bar alias",
          displayName: "bar",
          position: 0,
          pageType: "QuestionPage",
          confirmation: {
            id: "confirmation-1",
            __typename: "QuestionConfirmation",
          },
        },
        {
          __typename: "QuestionPage",
          id: "4",
          title: "blah",
          alias: "blah alias",
          displayName: "blah",
          position: 1,
          pageType: "QuestionPage",
          confirmation: {
            id: "confirmation-2",
            __typename: "QuestionConfirmation",
          },
        },
      ],
    },
  ],
  questionnaire: {
    __typename: "Questionnaire",
    id: questionnaireId,
    navigation: true,
    hub: false,
    collectionLists: {
      __typename: "collectionLists",
      id: "abc",
      lists: [],
    },
    questionnaireInfo: {
      __typename: "QuestionnaireInfo",
      totalSectionCount: 1,
    },
    collapsibleSummary: false,
  },
  validationErrorInfo: {
    id: "1",
    totalCount: 0,
    errors: [],
    __typename: "ValidationErrorInfo",
  },
};

const mockSectionQuery = {
  request: {
    query: SECTION_QUERY,
    variables: { input: { questionnaireId, sectionId } },
  },
  result: {
    data: { section },
  },
};

describe("SectionRoute", () => {
  let store,
    match,
    context,
    childContextTypes,
    user,
    history,
    publishStatusMock,
    questionnaireId;

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

    questionnaireId = "1";
    match = {
      params: { questionnaireId, sectionId: "2" },
    };

    store = {
      getState: jest.fn(() => ({
        toasts: {},
        saving: { apiDownError: false },
      })),
      subscribe: jest.fn(),
      dispatch: jest.fn(),
    };
    history = createMemoryHistory({ initialEntries: ["/q/1/section/2"] });
    context = createRouterContext({
      location: { pathname: buildSectionPath(match.params) },
      match,
    });
    publishStatusMock = {
      request: {
        query: publishStatusSubscription,
        variables: { id: questionnaireId },
      },
      result: () => ({
        data: {
          publishStatusUpdated: {
            id: questionnaireId,
            publishStatus: "Unpublished",
            __typename: "Questionnaire",
          },
        },
      }),
    };
  });

  describe("data fetching", () => {
    const render = (mocks) =>
      mount(
        <MeContext.Provider value={{ me: user }}>
          <Router history={history}>
            <TestProvider reduxProps={{ store }} apolloProps={{ mocks }}>
              <Route
                path={"/q/:questionnaireId/section/:sectionId"}
                component={SectionRoute}
              />
            </TestProvider>
          </Router>
        </MeContext.Provider>
      );

    it("should show loading spinner while request in flight", async () => {
      const wrapper = render([mockSectionQuery, publishStatusMock]);
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(true);
      expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(false);
      await act(async () => {
        await flushPromises();
      });
    });

    it("should render the editor once loaded", async () => {
      const wrapper = render([mockSectionQuery, publishStatusMock]);

      await act(async () => {
        await flushPromises();
      });
      wrapper.update();
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
    });

    it("should render error if problem with request", async () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: { input: { questionnaireId, sectionId } },
        },
        error: new Error("something went wrong"),
      };

      const wrapper = render([mock, publishStatusMock]);

      await act(async () => {
        await flushPromises();
      });
      wrapper.update();
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
      expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(false);
      expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
    });

    it("should render error if no section returned", async () => {
      const mock = {
        request: {
          query: SECTION_QUERY,
          variables: { input: { questionnaireId, sectionId } },
        },
        result: {
          data: null,
        },
      };

      const wrapper = render([mock, publishStatusMock]);
      await act(async () => {
        await flushPromises();
      });
      wrapper.update();
      expect(wrapper.find(`[data-test="loading"]`).exists()).toBe(false);
      expect(wrapper.find(`[data-test="section-editor"]`).exists()).toBe(false);
      expect(wrapper.find(`[data-test="error"]`).exists()).toBe(true);
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

    const render = (props = {}) =>
      mount(
        <MeContext.Provider value={{ me: user }}>
          <Router history={history}>
            <TestProvider
              reduxProps={{ store }}
              apolloProps={{ mocks: [publishStatusMock] }}
            >
              <Route path={"/q/:questionnaireId/section/:sectionId"}>
                {({ match }) => (
                  <UnwrappedSectionRoute match={match} {...props} />
                )}
              </Route>
            </TestProvider>
          </Router>
        </MeContext.Provider>,
        { context, childContextTypes }
      );

    it("ensures confirmation before delete", async () => {
      const wrapper = render({
        loading: false,
        match,
        section,
        ...mockHandlers,
      });

      wrapper.find(`[data-test="btn-delete"]`).first().simulate("click");

      wrapper
        .find(`[data-test="btn-modal-positive"]`)
        .first()
        .simulate("click");

      expect(mockHandlers.onDeleteSection).toHaveBeenCalledWith(sectionId);
      await act(async () => {
        await flushPromises();
      });
    });

    it("should disable move section button when one section", async () => {
      const wrapper = render({
        loading: false,
        match,
        section,
        ...mockHandlers,
      });
      expect(
        wrapper.find(`Button${byTestAttr("btn-move")}`).prop("disabled")
      ).toBe(true);
      await act(async () => {
        await flushPromises();
      });
    });

    it("should enable move section button when multiple sections", async () => {
      const questionnaire = {
        id: "1",
        navigation: true,
        hub: false,
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
      await act(async () => {
        await flushPromises();
      });
    });

    it("should call onDuplicateSection with the section id and position when the duplicate button is clicked", async () => {
      const questionnaire = {
        id: "1",
        navigation: true,
        hub: false,
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
      await act(async () => {
        await flushPromises();
      });
    });

    it("should disable the preview tab when the introduction is disabled", async () => {
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
      await act(async () => {
        await flushPromises();
      });
    });

    it("should enable the preview tab when introduction is enabled and introduction title or content is not empty", async () => {
      const wrapper = render({
        loading: false,
        match,
        section: {
          ...section,
          introductionTitle: "Title",
          introductionContent: "Content",
          introductionEnabled: true,
        },
        ...mockHandlers,
      });

      const editorLayout = wrapper.find(
        `EditorLayout${byTestAttr("section-route")}`
      );

      expect(editorLayout.props()).toMatchObject({
        preview: true,
      });
      await act(async () => {
        await flushPromises();
      });
    });

    it("should not enable the preview tab when introduction is not enabled and introduction title or content is not empty", async () => {
      const wrapper = render({
        loading: false,
        match,
        section: {
          ...section,
          introductionTitle: "Title",
          introductionContent: "Content",
          introductionEnabled: false,
        },
        ...mockHandlers,
      });

      const editorLayout = wrapper.find(
        `EditorLayout${byTestAttr("section-route")}`
      );

      expect(editorLayout.props()).toMatchObject({
        preview: false,
      });
      await act(async () => {
        await flushPromises();
      });
    });

    it("should not enable the preview tab when introduction is enabled and introduction title and content are empty", async () => {
      const wrapper = render({
        loading: false,
        match,
        section: {
          ...section,
          introductionTitle: "",
          introductionContent: "",
          introductionEnabled: true,
        },
        ...mockHandlers,
      });

      const editorLayout = wrapper.find(
        `EditorLayout${byTestAttr("section-route")}`
      );

      expect(editorLayout.props()).toMatchObject({
        preview: false,
      });
      await act(async () => {
        await flushPromises();
      });
    });
  });
});
