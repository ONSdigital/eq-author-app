import UnwrappedListCollectorPageEditor from ".";

import React from "react";
import {
  render,
  screen,
  act,
  fireEvent,
  queryByAttribute,
} from "tests/utils/rtl";
import { useQuery } from "@apollo/react-hooks";

jest.mock("components/NavigationCallbacks", () => ({
  useSetNavigationCallbacksForPage: () => null,
}));

jest.mock("@apollo/react-hooks", () => ({
  ...jest.requireActual("@apollo/react-hooks"),
  useQuery: jest.fn(),
  useSubscription: jest.fn(() => jest.fn()),
}));

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: {},
}));

describe("List Collector Page Editor", () => {
  let wrapper;

  let mockHandlers;
  let page;
  let section;
  let questionnaire;

  const answer = {
    id: "123",
    __typename: "Answer",
  };

  const match = {
    params: {
      questionnaireId: "1",
      sectionId: "2",
      pageId: "3",
    },
  };
  const history = {
    push: jest.fn(),
  };

  const renderListCollector = ({ ...props }) =>
    render(
      <UnwrappedListCollectorPageEditor
        {...mockHandlers}
        questionnaire={questionnaire}
        page={page}
        section={section}
        showMovePageDialog={false}
        showDeleteConfirmDialog={false}
        match={match}
        history={history}
        {...props}
      />
    );

  beforeEach(() => {
    mockHandlers = {
      onUpdateAnswer: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePageConfirm: jest.fn(),
      onCloseDeleteConfirmDialog: jest.fn(),
      onAddAnswer: jest.fn(() => Promise.resolve(answer)),
      onAddOption: jest.fn(),
      fetchAnswers: jest.fn(),
      onDeleteOption: jest.fn(),
      onDeleteAnswer: jest.fn(),
      onAddExclusive: jest.fn(),
      onUpdateOption: jest.fn(),
      onMovePage: jest.fn(),
      onCloseMovePageDialog: jest.fn(),
      onAddOther: jest.fn(),
      onDeleteOther: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
    };

    page = {
      __typename: "Page",
      id: "1",
      displayName: "Question",
      position: 1,
      title: "<p>Hello world</p>",
      alias: "Who am I?",
      anotherNegativeDescription: "",
      alias: "",
      title: "List Names",
      anotherPositiveDescription: "",
      addItemTitle: "What are the names of everyone who live at ?",
      anotherTitle: "Does anyone live at  as their permanent or family home?",
      pageType: "ListCollectorPage",
      anotherPositive: "Yes",
      id: "shortID",
      listId: "list-1",
      anotherNegative: "No",
      validationErrorInfo: {
        totalCount: 0,
        errors: [],
        id: "1",
        __typename: "ValidationErrorInfo",
      },
      answers: [
        {
          __typename: "BasicAnswer",
          id: "1",
          title: "First name",
          description: "",
          type: "TextField",
        },
        {
          __typename: "BasicAnswer",
          id: "2",
          title: "Last name",
          description: "",
          type: "TextField",
        },
      ],
      section: { id: "3", questionnaire: { id: "1", metadata: [] } },
    };

    section = {
      id: "3",
      pages: [page],
    };

    questionnaire = {
      id: "1",
      __typename: "Questionnaire",
      sections: [section],
      collectionLists: {
        lists: [
          {
            answers: [
              {
                secondaryLabel: null,

                description: null,
                properties: {
                  required: false,
                },
                id: "list-answer-1",
                label: "Pet's Name",
                guidance: null,
                type: "TextField",
                qCode: null,
              },
            ],
            id: "list-1",
            listName: "Pets",
            totalValidation: null,
          },
        ],
        id: "collection-lists-1",
      },
    };
  });
  describe("List Collector page", () => {
    it("should render", async () => {
      const { getByTestId } = await renderListCollector();
      // screen.debug(undefined, 60000);
      expect(getByTestId("list-page-editor")).toBeVisible();
    });

    it("add a list collector name", () => {
      const { getByTestId } = renderListCollector();

      const listNameInput = getByTestId("list-name-input");

      expect(listNameInput.value).toBe("List Names");

      fireEvent.change(listNameInput, {
        target: { value: "List Names 1" },
      });

      expect(listNameInput.value).toBe("List Names 1");
    });

    it("pick a list", () => {
      const { getByTestId } = renderListCollector();
      expect(getByTestId("list-page-editor")).toBeVisible();
      const listSelect = getByTestId("list-select");
      expect(listSelect.value).toBe("shortID");
    });

    it("add a repeating question", () => {
      const { getElemenById } = renderListCollector();
      const anotherRepeatingQuestionInput = getElemenById(
        "update-anotherTitle-textbox"
      );

      expect(anotherRepeatingQuestionInput.value).toBe(
        "What are the names of everyone who live at ?"
      );

      fireEvent.change(anotherRepeatingQuestionInput, {
        target: { value: "What are the names of everyone who live at ? 1" },
      });

      expect(anotherRepeatingQuestionInput.value).toBe(
        "hat are the names of everyone who live at ? 1"
      );
    });

    it("update a positive answer label", () => {
      const { getByTestId } = renderListCollector();
      const positiveAnswerInput = getByTestId("another-positive-input");

      expect(positiveAnswerInput.value).toBe("Yes");

      fireEvent.change(positiveAnswerInput, {
        target: { value: "Yes 1" },
      });

      expect(positiveAnswerInput.value).toBe("Yes 1");
    });

    it("update a negative answer label", () => {
      const { getByTestId } = renderListCollector();
      const negativeAnswerInput = getByTestId("another-negative-input");

      expect(negativeAnswerInput.value).toBe("No");

      fireEvent.change(negativeAnswerInput, {
        target: { value: "No 1" },
      });

      expect(negativeAnswerInput.value).toBe("No 1");
    });

    // it("add a collection question", () => {

    //   const reportingQuestionInput = queryByAttribute("#update-addItemTitle-textbox");

    //   expect(reportingQuestionInput.value).toBe("Does anyone live at  as their permanent or family home?");

    //   fireEvent.change(reportingQuestionInput, {
    //     target: { value: "Does anyone live at  as their permanent or family home? 1" },
    //   });

    //   expect(reportingQuestionInput.value).toBe("Does anyone live at  as their permanent or family home? 1");
    // });
  });
});
