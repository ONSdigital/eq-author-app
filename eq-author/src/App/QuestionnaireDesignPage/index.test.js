import React from "react";
import { render } from "tests/utils/rtl";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
import { useQuery } from "@apollo/react-hooks";
import {
  organiseAnswers,
  flattenAnswers,
  duplicatesAnswers,
} from "utils/getAllAnswersFlatMap";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";

import { PAGE } from "constants/entities";

import { UnwrappedQuestionnaireDesignPage as QuestionnaireDesignPage } from "./";

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

describe("QuestionnaireDesignPage", () => {
  let sectionsForFlatAnswers, answerList, flatAnswersTest, duplicateTest;

  const defaultSetup = (changes = {}) => {
    const questionnaire = buildQuestionnaire();
    questionnaire.totalErrorCount = 0;
    const page = questionnaire.sections[0].folders[0].pages[0];
    useQuery.mockImplementation(() => ({ loading: false, data: { page } }));
    const validations = {
      id: "3",
      errorCount: 0,
      pages: [],
    };

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

    const match = {
      params: {
        questionnaireId: questionnaire.id,
        entityName: PAGE,
        entityId: page.id,
      },
    };

    const props = {
      questionnaire,
      validations,
      match,
      loading: false,
      ...changes,
    };

    const signOut = jest.fn();

    const utils = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QuestionnaireContext.Provider value={questionnaire}>
          <QuestionnaireDesignPage {...props} />
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaire.id}/page/${page.id}/design`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId/:tab",
      }
    );
    return { ...utils };
  };

  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("question-page-editor")).toBeVisible();
    expect(getByTestId("main-navigation")).toBeVisible();
    expect(getByTestId("side-nav")).toBeVisible();
  });

  it("should render a loading state", () => {
    const { getByText } = defaultSetup({ loading: true });

    expect(getByText("Loading questionnaire…")).toBeVisible();
  });

  describe("Document title", () => {
    it("should display existing title if loading", () => {
      defaultSetup({ loading: true });
      expect(document.title).toEqual("- Page 1.1.1");
    });

    it("should display questionnaire title if no longer loading", () => {
      defaultSetup();
      expect(document.title).toEqual("questionnaire - Page 1.1.1");
    });
  });

  describe("getAllAnswersFlatMap", () => {
    sectionsForFlatAnswers = [
      {
        id: "4b0280df-c345-4c20-ada2-806105de87d6",
        title: "<p>sect1</p>",
        displayName: "sect1",
        questionnaire: {
          id: "bbb6f10d-4f95-4f96-8c66-1e777653dd4f",
          __typename: "Questionnaire",
        },
        folders: [
          {
            id: "14f7b1ef-b26c-4f6f-bdb6-37eff316b4d9",
            pages: [
              {
                id: "ff7e458d-028f-471c-a95d-2d3161da133e",
                title: "<p>Q1</p>",
                position: 0,
                displayName: "Q1",
                pageType: "QuestionPage",
                alias: null,
                confirmation: null,
                answers: [
                  {
                    id: "ID-Q1-1",
                    label: "num1",
                    secondaryLabel: "sec label1",
                    type: "Number",
                    properties: {
                      required: false,
                      decimals: 0,
                    },
                    length: 1,
                    qCode: "Duplicate",
                    secondaryQCode: "sec QCode1",
                    __typename: "BasicAnswer",
                    title: "<p>Q1</p>",
                  },
                ],
                __typename: "QuestionPage",
              },
            ],
            __typename: "Folder",
          },
          {
            id: "14f7b1ef-b26c-4f6f-bdb6-37eff316b4d9",
            pages: [
              {
                id: "ff7e458d-028f-471c-a95d-2d3161da133e",
                title: "<p>Q2</p>",
                position: 0,
                displayName: "Q2",
                pageType: "QuestionPage",
                alias: null,
                confirmation: null,
                answers: [
                  {
                    id: "ID-Q2-1",
                    label: "num2",
                    secondaryLabel: null,
                    type: "Number",
                    properties: {
                      required: false,
                      decimals: 0,
                    },
                    qCode: "Duplicate",
                    secondaryQCode: null,
                    __typename: "BasicAnswer",
                    length: 1,
                    title: "<p>Q2</p>",
                  },
                ],
                __typename: "QuestionPage",
              },
            ],
            __typename: "Folder",
          },
          {
            id: "600bdaed-eb6f-4541-8e8f-d9895afaba57",
            pages: [
              {
                id: "360002a6-eedb-4fa8-9d5c-51cdd6a78a18",
                title: "<p>q2 - chkbox</p>",
                position: 0,
                displayName: "q2 - chkbox",
                pageType: "QuestionPage",
                alias: null,
                confirmation: null,
                answers: [
                  {
                    id: "57f4d945-cd90-4596-8ec7-b7a1ef035c16",
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
                        id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
                        label: "checkbox 1",
                        qCode: null,
                        __typename: "Option",
                      },
                      {
                        id: "1e3eb896-be3d-4048-be69-269e125f5628",
                        label: "checkbox 2",
                        qCode: null,
                        __typename: "Option",
                      },
                    ],
                    mutuallyExclusiveOption: null,
                    __typename: "MultipleChoiceAnswer",
                  },
                ],
                __typename: "QuestionPage",
              },
            ],
            __typename: "Folder",
          },
        ],
        __typename: "Section",
      },
    ];

    answerList = [
      {
        title: "<p>Q1</p>",
        alias: null,
        answers: [
          {
            id: "ID-Q1-1",
            label: "num1",
            secondaryLabel: "sec label1",
            type: "Number",
            properties: {
              required: false,
              decimals: 0,
            },
            length: 1,
            qCode: "Duplicate",
            secondaryQCode: "sec QCode1",
            __typename: "BasicAnswer",
            title: "<p>Q1</p>",
          },
          {
            id: "ID-Q1-1",
            label: "sec label1",
            qCode: "sec QCode1",
            type: "Number",
            secondary: true,
          },
        ],
      },
      {
        title: "<p>Q2</p>",
        alias: null,
        answers: [
          {
            id: "ID-Q2-1",
            label: "num2",
            secondaryLabel: null,
            type: "Number",
            properties: {
              required: false,
              decimals: 0,
            },
            qCode: "Duplicate",
            secondaryQCode: null,
            __typename: "BasicAnswer",
            length: 1,
            title: "<p>Q2</p>",
          },
        ],
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        answers: [
          {
            id: "57f4d945-cd90-4596-8ec7-b7a1ef035c16",
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
                id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
                label: "checkbox 1",
                qCode: null,
                __typename: "Option",
              },
              {
                id: "1e3eb896-be3d-4048-be69-269e125f5628",
                label: "checkbox 2",
                qCode: null,
                __typename: "Option",
              },
            ],
            mutuallyExclusiveOption: null,
            __typename: "MultipleChoiceAnswer",
          },
          {
            id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
            label: "checkbox 1",
            qCode: null,
            __typename: "Option",
            type: "CheckboxOption",
            option: true,
          },
          {
            id: "1e3eb896-be3d-4048-be69-269e125f5628",
            label: "checkbox 2",
            qCode: null,
            __typename: "Option",
            type: "CheckboxOption",
            option: true,
          },
        ],
      },
    ];

    flatAnswersTest = [
      {
        title: "<p>Q1</p>",
        alias: null,
        id: "ID-Q1-1",
        label: "num1",
        secondaryLabel: "sec label1",
        type: "Number",
        properties: {
          required: false,
          decimals: 0,
        },
        length: 1,
        qCode: "Duplicate",
        secondaryQCode: "sec QCode1",
        __typename: "BasicAnswer",
      },
      {
        title: "<p>Q1</p>",
        alias: null,
        nested: true,
        id: "ID-Q1-1",
        label: "sec label1",
        qCode: "sec QCode1",
        type: "Number",
        secondary: true,
      },
      {
        title: "<p>Q2</p>",
        alias: null,
        id: "ID-Q2-1",
        label: "num2",
        secondaryLabel: null,
        type: "Number",
        properties: {
          required: false,
          decimals: 0,
        },
        qCode: "Duplicate",
        secondaryQCode: null,
        __typename: "BasicAnswer",
        length: 1,
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        id: "57f4d945-cd90-4596-8ec7-b7a1ef035c16",
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
            id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
            label: "checkbox 1",
            qCode: null,
            __typename: "Option",
          },
          {
            id: "1e3eb896-be3d-4048-be69-269e125f5628",
            label: "checkbox 2",
            qCode: null,
            __typename: "Option",
          },
        ],
        mutuallyExclusiveOption: null,
        __typename: "MultipleChoiceAnswer",
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        nested: true,
        id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
        label: "checkbox 1",
        qCode: null,
        __typename: "Option",
        type: "CheckboxOption",
        option: true,
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        nested: true,
        id: "1e3eb896-be3d-4048-be69-269e125f5628",
        label: "checkbox 2",
        qCode: null,
        __typename: "Option",
        type: "CheckboxOption",
        option: true,
      },
    ];

    duplicateTest = {
      Duplicate: 2,
      "sec QCode1": 1,
      "": 1,
      null: 1,
    };

    it("it should organiseAnswers into a list", () => {
      const answersListTest = organiseAnswers(sectionsForFlatAnswers);
      expect(answersListTest.answers).toEqual(answerList);
    });

    it("it should flatten answers", () => {
      const flattenedAnswers = flattenAnswers(answerList);
      expect(flattenedAnswers).toEqual(flatAnswersTest);
    });

    it("it should list duplicate answers", () => {
      const duplicates = duplicatesAnswers(flatAnswersTest);
      expect(duplicates).toEqual(duplicateTest);
    });
  });
});
