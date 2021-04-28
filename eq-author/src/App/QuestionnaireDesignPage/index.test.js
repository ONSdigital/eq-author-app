import React from "react";
import { render } from "tests/utils/rtl";
import {
  buildQuestionnaire,
  buildAnswers,
} from "tests/utils/createMockQuestionnaire";
import { useQuery } from "@apollo/react-hooks";
import {
  organiseAnswers,
  flattenAnswers,
  duplicatesAnswers,
} from "utils/getAllAnswersFlatMap";

import { MeContext } from "App/MeContext";
import { PAGE } from "constants/entities";
import { useParams } from "react-router-dom";

import QuestionnaireDesignPage from "./";
import useQuestionnaireQuery from "./useQuestionnaireQuery";

import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

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
      introduction: { id: "1" },
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

  describe("getAllAnswersFlatMap", () => {
    const checkboxAnswers = (refined) => [
      {
        id: "checkbox-answer",
        label: "",
        secondaryLabel: null,
        type: "Checkbox",
        properties: {
          required: false,
        },
        qCode: "",
        length: 2,
        options: [
          {
            id: "option-1",
            label: "checkbox 1",
            qCode: null,
            __typename: "Option",
            ...(refined && { option: true, type: "CheckboxOption" }),
          },
          {
            id: "option-2",
            label: "checkbox 2",
            qCode: null,
            __typename: "Option",
            ...(refined && { option: true, type: "CheckboxOption" }),
          },
        ],
        mutuallyExclusiveOption: {
          id: "mutually-exclusive-option",
          label: "mutually exclusive option",
          qCode: "1",
          __typename: "Option",
          ...(refined && { option: true, type: "MutuallyExclusiveOption" }),
        },
        ...(refined && { type: "Checkbox" }),
        __typename: "MultipleChoiceAnswer",
      },
    ];

    const checkboxPage = () => ({
      id: "checkbox-page",
      title: "<p>Checkbox page</p>",
      position: 0,
      displayName: "Checkbox page",
      pageType: "QuestionPage",
      alias: "asda",
      answers: checkboxAnswers(),
    });

    const refinedCheckbox = checkboxAnswers(true)[0];

    const answers = [
      {
        title: "Page 1.1.1",
        alias: "1.1.1",
        answers: buildAnswers({ answerCount: 1 }),
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        answers: [
          ...checkboxAnswers(),
          ...refinedCheckbox.options,
          refinedCheckbox.mutuallyExclusiveOption,
        ],
      },
    ];

    const flatAnswers = [
      {
        title: "Page 1.1.1",
        alias: "1.1.1",
        ...buildAnswers({ answerCount: 1 })[0],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        ...checkboxAnswers()[0],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.options[0],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.options[1],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.mutuallyExclusiveOption,
      },
    ];

    it("it should organiseAnswers into a list", () => {
      const questionnaire = buildQuestionnaire({
        pageCount: 2,
        answerCount: 1,
      });
      questionnaire.sections[0].folders[0].pages[1] = checkboxPage();
      const answersListTest = organiseAnswers(questionnaire.sections);
      expect(answersListTest.answers).toEqual(answers);
    });

    it("it should flatten answers", () => {
      const flat = flattenAnswers(answers);
      const mutuallyExclusiveOption = flat.find(
        (x) => x.type === "MutuallyExclusiveOption"
      );
      expect(flat).toEqual(flatAnswers);
      expect(mutuallyExclusiveOption).toBeTruthy();
    });

    it("it should list duplicate answers", () => {
      flatAnswers.push({
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.mutuallyExclusiveOption,
      });
      const duplicateTest = {
        1: 2,
      };
      const duplicates = duplicatesAnswers(flatAnswers);
      expect(duplicates).toEqual(duplicateTest);
    });
  });
});
