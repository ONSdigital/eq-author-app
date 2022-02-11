import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuery } from "@apollo/react-hooks";
import { MeContext } from "App/MeContext";
import { PAGE } from "constants/entities";
import { useParams } from "react-router-dom";

import QuestionnaireDesignPage from "./";
import useQuestionnaireQuery from "./useQuestionnaireQuery";

import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

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

jest.mock("components/BaseLayout/PermissionsBanner", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("components/EditorLayout/Header", () => ({
  __esModule: true,
  default: () => <></>,
}));

jest.mock("@apollo/react-hooks", () => ({
  __esModule: true,
  ...jest.requireActual("@apollo/react-hooks"),
  useSubscription: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useMatch: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock("hooks/useValidationsSubscription", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("./useQuestionnaireQuery", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("QuestionnaireDesignPage", () => {
  const setup = ({
    questionnaireChanges = {},
    questionnaireQuery: { data, loading = false, error = null } = {},
    routing = {},
  } = {}) => {
    const questionnaire = {
      ...buildQuestionnaire(),
      totalErrorCount: 0,
      introduction: {
        id: "1",
        validationErrorInfo: { errors: [], totalCount: 0 },
      },
      ...questionnaireChanges,
    };

    const page = questionnaire.sections[0].folders[0].pages[0];

    useQuestionnaireQuery.mockImplementation(() => ({
      loading,
      error,
      data: data !== undefined ? data : { questionnaire },
    }));

    useQuery.mockImplementation(() => ({
      loading: false,
      data: { page },
    }));

    const user = {
      id: "123",
      displayName: "Batman",
      name: "Bruce",
      email: "IAmBatman@dccomics.com",
      __typename: "User",
      picture: "",
      admin: true,
      signOut: jest.fn(),
    };

    useParams.mockImplementation(() => ({
      questionnaireId: questionnaire.id,
      entityName: PAGE,
      entityId: page.id,
    }));

    const utils = render(
      <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
        <QuestionnaireDesignPage />
      </MeContext.Provider>,
      {
        route: `/q/${questionnaire.id}/page/${page.id}/design`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId/:tab",
        ...routing,
      }
    );

    return { ...utils, questionnaire, page };
  };

  it("should render", () => {
    const { getByTestId } = setup();
    expect(getByTestId("question-page-editor")).toBeVisible();
    expect(getByTestId("main-navigation")).toBeVisible();
    expect(getByTestId("side-nav")).toBeVisible();
  });

  it("should redirect to a loading screen", () => {
    const route = `/q/questionnaire/`;
    const urlParamMatcher = "/q/:questionnaireId/";
    const { getByTestId } = setup({
      questionnaireQuery: { loading: true },
      routing: {
        route,
        urlParamMatcher,
      },
    });
    expect(getByTestId("loading")).toBeVisible();
  });

  it("should throw error when questionnaire not found and no graphql errors", () => {
    jest.spyOn(console, "error");
    // needed to stop error printing to console
    // eslint-disable-next-line no-console
    console.error.mockImplementation(() => {});
    expect(() =>
      setup({
        questionnaireQuery: { data: { questionnaire: null } },
      })
    ).toThrow(ERR_PAGE_NOT_FOUND);
  });

  it("should throw error when access to questionnaire is unauthorized", () => {
    expect(() =>
      setup({
        questionnaireQuery: {
          error: {
            networkError: { bodyText: ERR_UNAUTHORIZED_QUESTIONNAIRE },
          },
          loading: false,
        },
      })
    ).toThrow(ERR_UNAUTHORIZED_QUESTIONNAIRE);
  });

  describe("Document title", () => {
    it("should display existing title if loading", () => {
      setup({ questionnaireQuery: { loading: true } });
      expect(document.title).toEqual("- Page 1.1.1");
    });

    it("should display questionnaire title if no longer loading", () => {
      setup();
      expect(document.title).toEqual("questionnaire - Page 1.1.1");
    });
  });

  describe("Keyboard Nav Tests", () => {
    it("should focus on a nav block when the hotkey F6 button is pressed while focused on the main nav", () => {
      const { getByTestId } = setup();
      const startFocus = getByTestId("keyNav");
      const expectedFocus = getByTestId("side-nav");

      fireEvent.keyDown(startFocus, {
        key: "F6",
        code: "F6",
        keyCode: 117,
        charCode: 117,
      });

      expect(expectedFocus).toHaveFocus();
    });

    it("should focus on a the main nav block when the hotkey shift F6 button is pressed while focused on the side nav", () => {
      const { getByTestId } = setup();
      const startFocus = getByTestId("side-nav");
      const expectedFocus = getByTestId("keyNav");

      fireEvent.keyDown(startFocus, {
        shiftKey: true,
        key: "F6",
        code: "F6",
        keyCode: 117,
        charCode: 117,
      });

      expect(expectedFocus).toHaveFocus();
    });
  });
});
