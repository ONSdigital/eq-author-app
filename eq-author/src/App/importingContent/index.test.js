import React from "react";
import { useParams } from "react-router-dom";
import ImportingContent from "./";
import { render, fireEvent, screen } from "tests/utils/rtl";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { useQuestionnaire } from "components/QuestionnaireContext";
import {
  buildQuestionnaire,
  buildListCollectorFolders,
} from "tests/utils/createMockQuestionnaire";

import { WRITE } from "constants/questionnaire-permissions";
import { UNPUBLISHED } from "constants/publishStatus";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

jest.mock("components/QuestionnaireContext", () => ({
  useQuestionnaire: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

const destinationQuestionnaire = buildQuestionnaire({ answerCount: 1 });
const listCollectorFolder = buildListCollectorFolders()[0];
destinationQuestionnaire.sections[0].folders[1] = listCollectorFolder;
listCollectorFolder.position = 1;

const extraSpaceModalTitle =
  "Confirm the removal of extra spaces from selected content";

const sourceQuestionnaires = [
  {
    id: "source-questionnaire-id",
    title: "Source questionnaire 1",
    displayName: "Source questionnaire 1",
    updatedAt: "2023-01-31T15:13:50.350Z",
    createdAt: "2023-01-31T15:00:28.941Z",
    shortTitle: "Test title",
    starred: false,
    locked: false,
    permission: WRITE,
    publishStatus: UNPUBLISHED,
    createdBy: {
      displayName: "mock@gmail.com",
      email: "mock@gmail.com",
      id: "user-id",
      name: null,
      __typename: "User",
    },
    sections: [
      {
        id: "section-1",
        title: "Section 1",
        alias: "",
        displayName: "Section 1",
        folders: [
          {
            id: "folder-1",
            displayName: "Folder 1",
            pages: [
              {
                id: "page-1",
                title: "Page 1",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-1",
                    type: "Number",
                  },
                ],
              },
              {
                id: "page-2",
                title: "Page 2",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-2",
                    type: "Number",
                  },
                ],
              },
              {
                id: "page-with-confirmation-1",
                title: "Page with confirmation 1",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-with-confirmation",
                    type: "Number",
                  },
                ],
                confirmation: {
                  id: "confirmation-page",
                  title: "Confirm answer",
                  positive: {
                    id: "confirmation-positive-option",
                    label: "Yes",
                  },
                  negative: {
                    id: "confirmation-negative-option",
                    label: "No",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: "section-2",
        title: "Section 2",
        alias: "",
        displayName: "Section 2",
        folders: [
          {
            id: "folder-2",
            displayName: "Folder 2",
            pages: [
              {
                id: "page-3",
                title: "Page 3",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-3",
                    type: "Number",
                  },
                ],
              },
              {
                id: "page-4",
                title: "Page 4",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-4",
                    type: "Number",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "section-3",
        title: "Section 3",
        alias: "",
        displayName: "Section 3",
        folders: [
          {
            id: "folder-3",
            displayName: "Folder 3",
            pages: [
              {
                id: "page-5",
                title: "Page 5",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-5",
                    type: "Number",
                  },
                ],
              },
              {
                id: "page-6",
                title: "Page 6",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-6",
                    type: "Number",
                    label: "Answer 6  with extra spaces",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "section-4",
        title: "Section 4",
        alias: "",
        displayName: "Section 4",
        folders: [
          {
            id: "folder-4",
            displayName: "Folder 4",
            pages: [
              {
                id: "page-7",
                title: " Page 7",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-7",
                    type: "Number",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "section-5",
        title: "Section 5",
        alias: "",
        displayName: "Section 5",
        folders: [
          {
            id: "folder-5",
            displayName: "Folder 5",
            pages: [
              {
                id: "page-8",
                title: "<p>Page 8 </p>",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-8",
                    type: "Number",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: "section-6",
        title: "Section 6",
        alias: "",
        displayName: "Section 6",
        folders: [
          {
            id: "folder-6",
            displayName: "Folder 6",
            pages: [
              {
                id: "page-9",
                title: "<p> Page 9</p>",
                pageType: "QuestionPage",
                answers: [
                  {
                    id: "answer-9",
                    type: "Number",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

useQuestionnaire.mockImplementation(() => ({
  questionnaire: destinationQuestionnaire,
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

useParams.mockImplementation(() => ({
  questionnaireId: destinationQuestionnaire.id,
  entityName: "page",
  entityId: destinationQuestionnaire.sections[0].folders[0].pages[0].id,
}));

const setImportingContent = jest.fn();

// Fix for TypeError: rowRef.current.scrollIntoView is not a function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const renderImportingContent = (props) =>
  render(
    <ImportingContent
      questionnaires={sourceQuestionnaires}
      stopImporting={() => setImportingContent(false)}
      targetInsideFolder
      {...props}
    />
  );

useQuery.mockImplementation(() => ({
  loading: false,
  error: false,
  data: {
    questionnaires: sourceQuestionnaires,
    questionnaire: sourceQuestionnaires[0],
  },
}));

describe("Importing content", () => {
  it("should render ImportingContent questionnaire select modal", () => {
    const { getByTestId } = renderImportingContent();

    expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
  });

  it("should close the questionnaire select modal", () => {
    const { getByTestId, queryByTestId } = renderImportingContent();
    fireEvent.click(getByTestId("cancel-btn"));
    expect(queryByTestId("questionnaire-select-modal")).not.toBeInTheDocument();
  });

  it("should select a source questionnaire", () => {
    const { getByTestId, getAllByTestId, getByText } = renderImportingContent();

    fireEvent.click(getByText(/All/));
    const allRows = getAllByTestId("table-row");
    fireEvent.click(allRows[0]);
    fireEvent.click(getByTestId("confirm-btn"));

    expect(
      getByText(/Import content from Source questionnaire/i)
    ).toBeInTheDocument();
  });

  it("should render empty fragment for questionnire list loading", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: true,
      error: false,
      data: {
        questionnaires: sourceQuestionnaires,
        questionnaire: sourceQuestionnaires[0],
      },
    }));

    const { queryByTestId } = renderImportingContent();

    expect(queryByTestId("questionnaire-select-modal")).not.toBeInTheDocument();
  });

  it("should render empty fragment for questionnire list error", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: true,
      data: {
        questionnaires: sourceQuestionnaires,
        questionnaire: sourceQuestionnaires[0],
      },
    }));

    const { queryByTestId } = renderImportingContent();

    expect(queryByTestId("questionnaire-select-modal")).not.toBeInTheDocument();
  });

  it("should render empty fragment for questionnire list with no data", () => {
    useQuery.mockImplementationOnce(() => ({
      loading: false,
      error: false,
      data: null,
    }));

    const { queryByTestId } = renderImportingContent();

    expect(queryByTestId("questionnaire-select-modal")).not.toBeInTheDocument();
  });

  describe("import questions", () => {
    it("should open the 'Select the question(s) to import' modal", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      expect(getByText("Select the question(s) to import")).toBeInTheDocument();
    });

    it("should select and import the question page", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      fireEvent.click(getByText("Page 1"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Page 1")).toBeInTheDocument();
      expect(
        getByText("Import content from Source questionnaire 1")
      ).toBeInTheDocument();
    });

    it("should cancel select question page modal", async () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      fireEvent.click(getByText("Page 1"));
      fireEvent.click(getByTestId("button-group").children[0]);

      expect(queryByText("Page 1")).not.toBeInTheDocument();
      expect(
        queryByText("Select sections, folders or questions to import")
      ).toBeInTheDocument();
    });

    it("should return to questionnaire selector modal on back button click from question review modal", async () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      fireEvent.click(getByText("Page 1"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(queryByText("Page 1")).toBeInTheDocument();
      expect(
        getByText("Import content from Source questionnaire 1")
      ).toBeInTheDocument();

      const backButton = getByText("Back");
      fireEvent.click(backButton);

      expect(queryByText("Page 1")).not.toBeInTheDocument();
      expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
      expect(
        queryByText("Select the source questionnaire")
      ).toBeInTheDocument();
      expect(queryByText("Source questionnaire 1")).toBeInTheDocument();
    });

    it("should remove all selected question pages", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      fireEvent.click(getByText("Page 1"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(getByText("Remove all"));

      expect(queryByText("Page 1")).not.toBeInTheDocument();
      expect(queryByText("Page 2")).not.toBeInTheDocument();
      expect(
        getByText("Select sections, folders or questions to import")
      ).toBeInTheDocument();
    });

    it("should remove selected question page using the remove button", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      fireEvent.click(getByText("Page 1"));
      fireEvent.click(getByText("Page 2"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(screen.getAllByLabelText("Remove")[0]); // click remove question button, x button

      expect(queryByText("Page 1")).not.toBeInTheDocument();
      expect(getByText("Page 2")).toBeInTheDocument();
      expect(getByText("Question to import")).toBeInTheDocument();
    });

    it("should select multiple question pages", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      fireEvent.click(getByText("Page 1"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(getByTestId("question-review-select-questions-button"));
      fireEvent.click(getByText("Page 2"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Page 2")).toBeInTheDocument();
      expect(getByText("Page 1")).toBeInTheDocument();
      expect(getByText("Questions to import")).toBeInTheDocument();
    });

    it("should only display pages without confirmation questions when target is list folder", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent({ targetIsListCollectorFolder: true });
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );

      fireEvent.click(questionsButton);
      // fireEvent.click(getByText("Page 1"));
      // fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Page 1")).toBeInTheDocument();
      expect(queryByText("page-with-confirmation-1")).not.toBeInTheDocument();
    });

    it("should render empty fragment for question list loading", () => {
      const { queryByText, getByTestId, getByText, getAllByTestId } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );
      useQuery.mockImplementationOnce(() => ({
        loading: true,
      }));
      fireEvent.click(questionsButton);

      expect(
        queryByText("Select the question(s) to import")
      ).not.toBeInTheDocument();
    });

    it("should render empty fragment for question list error", () => {
      const { queryByText, getByTestId, getByText, getAllByTestId } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const questionsButton = getByTestId(
        "content-modal-select-questions-button"
      );
      useQuery.mockImplementationOnce(() => ({
        error: true,
      }));
      fireEvent.click(questionsButton);

      expect(
        queryByText("Select the question(s) to import")
      ).not.toBeInTheDocument();
    });

    describe("Confirm import question", () => {
      it("should import question to destination questionnaire page", () => {
        const mockImportQuestions = jest.fn();
        useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const questionsButton = getByTestId(
          "content-modal-select-questions-button"
        );

        fireEvent.click(questionsButton);
        fireEvent.click(getByText("Page 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportQuestions).toHaveBeenCalledTimes(1);
        expect(mockImportQuestions).toHaveBeenCalledWith({
          variables: {
            input: {
              questionIds: [sourceSection.folders[0].pages[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                folderId: destinationSection.folders[0].id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import question to destination questionnaire inside folder", () => {
        const mockImportQuestions = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "folder",
          entityId: destinationQuestionnaire.sections[0].folders[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const questionsButton = getByTestId(
          "content-modal-select-questions-button"
        );

        fireEvent.click(questionsButton);
        fireEvent.click(getByText("Page 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportQuestions).toHaveBeenCalledTimes(1);
        expect(mockImportQuestions).toHaveBeenCalledWith({
          variables: {
            input: {
              questionIds: [sourceSection.folders[0].pages[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                folderId: destinationSection.folders[0].id,
                index: 0,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import question to destination questionnaire outside folder", () => {
        const mockImportQuestions = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "folder",
          entityId: destinationQuestionnaire.sections[0].folders[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent({ targetInsideFolder: false });
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const questionsButton = getByTestId(
          "content-modal-select-questions-button"
        );

        fireEvent.click(questionsButton);
        fireEvent.click(getByText("Page 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportQuestions).toHaveBeenCalledTimes(1);
        expect(mockImportQuestions).toHaveBeenCalledWith({
          variables: {
            input: {
              questionIds: [sourceSection.folders[0].pages[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import question to destination questionnaire section", () => {
        const mockImportQuestions = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "section",
          entityId: destinationQuestionnaire.sections[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const questionsButton = getByTestId(
          "content-modal-select-questions-button"
        );

        fireEvent.click(questionsButton);
        fireEvent.click(getByText("Page 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportQuestions).toHaveBeenCalledTimes(1);
        expect(mockImportQuestions).toHaveBeenCalledWith({
          variables: {
            input: {
              questionIds: [sourceSection.folders[0].pages[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 0,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      describe("List collector folder", () => {
        it("should import question to correct position in destination questionnaire inside list folder", () => {
          const mockImportQuestions = jest.fn();
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "folder",
            entityId: destinationQuestionnaire.sections[0].folders[1].id,
          }));

          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 1"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[0];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[0].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  folderId: destinationSection.folders[1].id,
                  index: 2,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should import question to destination list collector qualifier page", () => {
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "page",
            entityId:
              destinationQuestionnaire.sections[0].folders[1].pages[0].id,
          }));

          const mockImportQuestions = jest.fn();
          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 1"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[0];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[0].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  folderId: destinationSection.folders[1].id,
                  index: 2,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should import question to destination list collector confirmation page", () => {
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "page",
            entityId:
              destinationQuestionnaire.sections[0].folders[1].pages[2].id,
          }));

          const mockImportQuestions = jest.fn();
          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 1"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[0];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[0].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  index: 2,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });
      });

      describe("Extra spaces", () => {
        it("should display extra space confirmation modal before importing questions containing extra spaces", () => {
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "page",
            entityId:
              destinationQuestionnaire.sections[0].folders[0].pages[0].id,
          }));

          const mockImportQuestions = jest.fn();
          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));

          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 6"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[2];
          const destinationSection = destinationQuestionnaire.sections[0];

          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[1].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  folderId: destinationSection.folders[0].id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should display extra space confirmation modal before importing questions containing trailing spaces", () => {
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "page",
            entityId:
              destinationQuestionnaire.sections[0].folders[0].pages[0].id,
          }));

          const mockImportQuestions = jest.fn();
          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));

          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 7"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[3];
          const destinationSection = destinationQuestionnaire.sections[0];

          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[0].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  folderId: destinationSection.folders[0].id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should display extra space confirmation modal before importing questions including trailing spaces wrapped in tags", () => {
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "page",
            entityId:
              destinationQuestionnaire.sections[0].folders[0].pages[0].id,
          }));

          const mockImportQuestions = jest.fn();
          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));

          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 8"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[4];
          const destinationSection = destinationQuestionnaire.sections[0];

          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[0].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  folderId: destinationSection.folders[0].id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should display extra space confirmation modal before importing questions including leading spaces wrapped in tags", () => {
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "page",
            entityId:
              destinationQuestionnaire.sections[0].folders[0].pages[0].id,
          }));

          const mockImportQuestions = jest.fn();
          useMutation.mockImplementation(jest.fn(() => [mockImportQuestions]));

          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const questionsButton = getByTestId(
            "content-modal-select-questions-button"
          );

          fireEvent.click(questionsButton);
          fireEvent.click(getByText("Page 9"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[5];
          const destinationSection = destinationQuestionnaire.sections[0];

          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportQuestions).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportQuestions).toHaveBeenCalledTimes(1);
          expect(mockImportQuestions).toHaveBeenCalledWith({
            variables: {
              input: {
                questionIds: [sourceSection.folders[0].pages[0].id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  folderId: destinationSection.folders[0].id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });
      });
    });
  });

  describe("import folders", () => {
    it("should open the 'Select the folder(s) to import' modal", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);

      expect(getByText("Select the folder(s) to import")).toBeInTheDocument();
    });

    it("should display a selected folder on the review modal", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);
      fireEvent.click(getByText("Folder 1"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Folder 1")).toBeInTheDocument();
      expect(
        getByText("Import content from Source questionnaire 1")
      ).toBeInTheDocument();
    });

    it("should cancel select folder modal", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);
      fireEvent.click(getByText("Folder 1"));

      fireEvent.click(getByTestId("button-group").children[0]);

      expect(queryByText("Folder 1")).not.toBeInTheDocument();
      expect(
        queryByText("Select sections, folders or questions to import")
      ).toBeInTheDocument();
    });

    it("should return to questionnaire selector modal on back button click from folder review modal", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);
      fireEvent.click(getByText("Folder 1"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(queryByText("Folder 1")).toBeInTheDocument();
      expect(
        getByText("Import content from Source questionnaire 1")
      ).toBeInTheDocument();

      const backButton = getByText("Back");
      fireEvent.click(backButton);

      expect(queryByText("Folder 1")).not.toBeInTheDocument();
      expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
      expect(
        queryByText("Select the source questionnaire")
      ).toBeInTheDocument();
      expect(queryByText("Source questionnaire 1")).toBeInTheDocument();
    });

    it("should remove all selected folders", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);
      fireEvent.click(getByText("Folder 1"));
      fireEvent.click(getByText("Folder 2"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(queryByText("Folder 1")).toBeInTheDocument();
      expect(queryByText("Folder 2")).toBeInTheDocument();

      fireEvent.click(getByText("Remove all"));

      expect(queryByText("Folder 1")).not.toBeInTheDocument();
      expect(queryByText("Folder 2")).not.toBeInTheDocument();
      expect(
        getByText("Select sections, folders or questions to import")
      ).toBeInTheDocument();
    });

    it("should remove a selected folder using the item's remove button", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);
      fireEvent.click(getByText("Folder 1"));
      fireEvent.click(getByText("Folder 2"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Folder 1")).toBeInTheDocument();
      expect(getByText("Folder 2")).toBeInTheDocument();
      expect(getByText("Folders to import")).toBeInTheDocument();

      fireEvent.click(getByTestId("folder-review-item-remove-button-folder-1"));

      expect(queryByText("Folder 1")).not.toBeInTheDocument();
      expect(getByText("Folder 2")).toBeInTheDocument();
      expect(getByText("Folder to import")).toBeInTheDocument();
    });

    it("should select multiple folders", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");

      fireEvent.click(foldersButton);
      fireEvent.click(getByText("Folder 1"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(getByTestId("folder-review-select-folders-button"));
      fireEvent.click(getByText("Folder 2"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Folder 1")).toBeInTheDocument();
      expect(getByText("Folder 2")).toBeInTheDocument();
      expect(getByText("Folders to import")).toBeInTheDocument();
    });

    it("should render empty fragment for folder list loading", () => {
      const { queryByText, getByTestId, getByText, getAllByTestId } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");
      useQuery.mockImplementationOnce(() => ({
        loading: true,
      }));
      fireEvent.click(foldersButton);

      expect(
        queryByText("Select the folder(s) to import")
      ).not.toBeInTheDocument();
    });

    it("should render empty fragment for folder list error", () => {
      const { queryByText, getByTestId, getByText, getAllByTestId } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const foldersButton = getByTestId("content-modal-select-folders-button");
      useQuery.mockImplementationOnce(() => ({
        error: true,
      }));
      fireEvent.click(foldersButton);

      expect(
        queryByText("Select the folder(s) to import")
      ).not.toBeInTheDocument();
    });

    describe("Confirm import folder", () => {
      it("should import folder to destination questionnaire section", () => {
        const mockImportFolders = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "section",
          entityId: destinationQuestionnaire.sections[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportFolders]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const foldersButton = getByTestId(
          "content-modal-select-folders-button"
        );

        fireEvent.click(foldersButton);
        fireEvent.click(getByText("Folder 1"));
        // Folder picker's "Select" button
        fireEvent.click(getByTestId("button-group").children[1]);
        // Folder review modal's "Import" button
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportFolders).toHaveBeenCalledTimes(1);
        expect(mockImportFolders).toHaveBeenCalledWith({
          variables: {
            input: {
              folderIds: [sourceSection.folders[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 0,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import folder to destination questionnaire folder", () => {
        const mockImportFolders = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "folder",
          entityId: destinationQuestionnaire.sections[0].folders[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportFolders]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const foldersButton = getByTestId(
          "content-modal-select-folders-button"
        );

        fireEvent.click(foldersButton);
        fireEvent.click(getByText("Folder 1"));
        // Folder picker's "Select" button
        fireEvent.click(getByTestId("button-group").children[1]);
        // Folder review modal's "Import" button
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportFolders).toHaveBeenCalledTimes(1);
        expect(mockImportFolders).toHaveBeenCalledWith({
          variables: {
            input: {
              folderIds: [sourceSection.folders[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import folder to destination questionnaire page", () => {
        const mockImportFolders = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "page",
          entityId: destinationQuestionnaire.sections[0].folders[0].pages[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportFolders]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const foldersButton = getByTestId(
          "content-modal-select-folders-button"
        );

        fireEvent.click(foldersButton);
        fireEvent.click(getByText("Folder 1"));
        // Folder picker's "Select" button
        fireEvent.click(getByTestId("button-group").children[1]);
        // Folder review modal's "Import" button
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportFolders).toHaveBeenCalledTimes(1);
        expect(mockImportFolders).toHaveBeenCalledWith({
          variables: {
            input: {
              folderIds: [sourceSection.folders[0].id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });
    });
  });

  describe("import sections", () => {
    it("should open the 'Select the section(s) to import' modal", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      expect(getByText("Select the section(s) to import")).toBeInTheDocument();
    });

    it("should select and import a section", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      fireEvent.click(getByText("Section 1"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Section 1")).toBeInTheDocument();
      expect(
        getByText("Import content from Source questionnaire 1")
      ).toBeInTheDocument();
    });

    it("should cancel select section modal", async () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      fireEvent.click(getByText("Section 1"));
      fireEvent.click(getByTestId("button-group").children[0]);

      expect(queryByText("Section 1")).not.toBeInTheDocument();
      expect(
        queryByText("Select sections, folders or questions to import")
      ).toBeInTheDocument();
    });

    it("should return to questionnaire selector modal on back button click from section review modal ", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      fireEvent.click(getByText("Section 1"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Section 1")).toBeInTheDocument();
      expect(
        getByText("Import content from Source questionnaire 1")
      ).toBeInTheDocument();

      const backButton = getByText("Back");
      fireEvent.click(backButton);

      expect(queryByText("Section 1")).not.toBeInTheDocument();
      expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
      expect(
        queryByText("Select the source questionnaire")
      ).toBeInTheDocument();
      expect(queryByText("Source questionnaire 1")).toBeInTheDocument();
    });

    it("should remove all selected sections", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      fireEvent.click(getByText("Section 1"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(getByText("Remove all"));

      expect(queryByText("Section 1")).not.toBeInTheDocument();
      expect(queryByText("Section 2")).not.toBeInTheDocument();
      expect(
        getByText("Select sections, folders or questions to import")
      ).toBeInTheDocument();
    });

    it("should remove selected section using the remove button", () => {
      const { getByTestId, getAllByTestId, getByText, queryByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      fireEvent.click(getByText("Section 1"));
      fireEvent.click(getByText("Section 2"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(screen.getAllByLabelText("Remove")[0]); // click remove question button, x button

      expect(queryByText("Section 1")).not.toBeInTheDocument();
      expect(getByText("Section 2")).toBeInTheDocument();
      expect(getByText("Section to import")).toBeInTheDocument();
    });

    it("should select multiple sections", () => {
      const { getByTestId, getAllByTestId, getByText } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );

      fireEvent.click(sectionsButton);
      fireEvent.click(getByText("Section 1"));
      fireEvent.click(getByTestId("button-group").children[1]);
      fireEvent.click(getByTestId("section-review-select-sections-button"));
      fireEvent.click(getByText("Section 2"));
      fireEvent.click(getByTestId("button-group").children[1]);

      expect(getByText("Section 2")).toBeInTheDocument();
      expect(getByText("Section 1")).toBeInTheDocument();
      expect(getByText("Sections to import")).toBeInTheDocument();
    });

    it("should render empty fragment for section list loading", () => {
      const { queryByText, getByTestId, getByText, getAllByTestId } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );
      useQuery.mockImplementationOnce(() => ({
        loading: true,
      }));
      fireEvent.click(sectionsButton);

      expect(
        queryByText("Select the section(s) to import")
      ).not.toBeInTheDocument();
    });

    it("should render empty fragment for section list error", () => {
      const { queryByText, getByTestId, getByText, getAllByTestId } =
        renderImportingContent();
      fireEvent.click(getByText(/All/));
      const allRows = getAllByTestId("table-row");
      fireEvent.click(allRows[0]);
      fireEvent.click(getByTestId("confirm-btn"));

      const sectionsButton = getByTestId(
        "content-modal-select-sections-button"
      );
      useQuery.mockImplementationOnce(() => ({
        error: true,
      }));
      fireEvent.click(sectionsButton);

      expect(
        queryByText("Select the section(s) to import")
      ).not.toBeInTheDocument();
    });

    describe("Confirm import section", () => {
      it("should import section to destination questionnaire section", () => {
        const mockImportSections = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "section",
          entityId: destinationQuestionnaire.sections[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const sectionsButton = getByTestId(
          "content-modal-select-sections-button"
        );

        fireEvent.click(sectionsButton);
        fireEvent.click(getByText("Section 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportSections).toHaveBeenCalledTimes(1);
        expect(mockImportSections).toHaveBeenCalledWith({
          variables: {
            input: {
              sectionIds: [sourceSection.id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import section to destination questionnaire folder", () => {
        const mockImportSections = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "folder",
          entityId: destinationQuestionnaire.sections[0].folders[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const sectionsButton = getByTestId(
          "content-modal-select-sections-button"
        );

        fireEvent.click(sectionsButton);
        fireEvent.click(getByText("Section 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportSections).toHaveBeenCalledTimes(1);
        expect(mockImportSections).toHaveBeenCalledWith({
          variables: {
            input: {
              sectionIds: [sourceSection.id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      it("should import section to destination questionnaire page", () => {
        const mockImportSections = jest.fn();
        useParams.mockImplementation(() => ({
          questionnaireId: destinationQuestionnaire.id,
          entityName: "page",
          entityId: destinationQuestionnaire.sections[0].folders[0].pages[0].id,
        }));

        useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
        const { getByTestId, getAllByTestId, getByText, queryByText } =
          renderImportingContent();
        fireEvent.click(getByText(/All/));
        const allRows = getAllByTestId("table-row");
        fireEvent.click(allRows[0]);
        fireEvent.click(getByTestId("confirm-btn"));

        const sectionsButton = getByTestId(
          "content-modal-select-sections-button"
        );

        fireEvent.click(sectionsButton);
        fireEvent.click(getByText("Section 1"));
        fireEvent.click(getByTestId("button-group").children[1]);
        fireEvent.click(getByTestId("button-group").children[0]);

        const sourceSection = sourceQuestionnaires[0].sections[0];
        const destinationSection = destinationQuestionnaire.sections[0];

        // Test modal closes
        expect(
          queryByText("Import content from Source questionnaire 1")
        ).not.toBeInTheDocument();

        expect(mockImportSections).toHaveBeenCalledTimes(1);
        expect(mockImportSections).toHaveBeenCalledWith({
          variables: {
            input: {
              sectionIds: [sourceSection.id],
              questionnaireId: sourceQuestionnaires[0].id,
              position: {
                sectionId: destinationSection.id,
                index: 1,
              },
            },
          },
          refetchQueries: ["GetQuestionnaire"],
        });
      });

      describe("Extra spaces", () => {
        it("should display extra space confirmation modal before importing sections containing extra spaces", () => {
          const mockImportSections = jest.fn();
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "section",
            entityId: destinationQuestionnaire.sections[0].id,
          }));

          useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const sectionsButton = getByTestId(
            "content-modal-select-sections-button"
          );

          fireEvent.click(sectionsButton);
          fireEvent.click(getByText("Section 3"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[2];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportSections).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportSections).toHaveBeenCalledTimes(1);

          expect(mockImportSections).toHaveBeenCalledWith({
            variables: {
              input: {
                sectionIds: [sourceSection.id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should display extra space confirmation modal before importing sections containing trailing spaces", () => {
          const mockImportSections = jest.fn();
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "section",
            entityId: destinationQuestionnaire.sections[0].id,
          }));

          useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const sectionsButton = getByTestId(
            "content-modal-select-sections-button"
          );

          fireEvent.click(sectionsButton);
          fireEvent.click(getByText("Section 4"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[3];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportSections).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportSections).toHaveBeenCalledTimes(1);

          expect(mockImportSections).toHaveBeenCalledWith({
            variables: {
              input: {
                sectionIds: [sourceSection.id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should display extra space confirmation modal before importing sections containing tags with trailing spaces", () => {
          const mockImportSections = jest.fn();
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "section",
            entityId: destinationQuestionnaire.sections[0].id,
          }));

          useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const sectionsButton = getByTestId(
            "content-modal-select-sections-button"
          );

          fireEvent.click(sectionsButton);
          fireEvent.click(getByText("Section 5"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[4];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportSections).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportSections).toHaveBeenCalledTimes(1);

          expect(mockImportSections).toHaveBeenCalledWith({
            variables: {
              input: {
                sectionIds: [sourceSection.id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });

        it("should display extra space confirmation modal before importing sections containing tags with leading spaces", () => {
          const mockImportSections = jest.fn();
          useParams.mockImplementation(() => ({
            questionnaireId: destinationQuestionnaire.id,
            entityName: "section",
            entityId: destinationQuestionnaire.sections[0].id,
          }));

          useMutation.mockImplementation(jest.fn(() => [mockImportSections]));
          const { getByTestId, getAllByTestId, getByText, queryByText } =
            renderImportingContent();
          fireEvent.click(getByText(/All/));
          const allRows = getAllByTestId("table-row");
          fireEvent.click(allRows[0]);
          fireEvent.click(getByTestId("confirm-btn"));

          const sectionsButton = getByTestId(
            "content-modal-select-sections-button"
          );

          fireEvent.click(sectionsButton);
          fireEvent.click(getByText("Section 6"));
          fireEvent.click(getByTestId("button-group").children[1]);
          fireEvent.click(getByTestId("button-group").children[0]);

          const sourceSection = sourceQuestionnaires[0].sections[5];
          const destinationSection = destinationQuestionnaire.sections[0];

          // Test modal closes
          expect(
            queryByText("Import content from Source questionnaire 1")
          ).not.toBeInTheDocument();

          expect(mockImportSections).toHaveBeenCalledTimes(0);

          // Extra space confirmation modal

          expect(queryByText(extraSpaceModalTitle)).toBeInTheDocument();
          const extraSpaceModalConfirmButton =
            getByTestId("btn-modal-positive");

          fireEvent.click(extraSpaceModalConfirmButton);
          expect(mockImportSections).toHaveBeenCalledTimes(1);

          expect(mockImportSections).toHaveBeenCalledWith({
            variables: {
              input: {
                sectionIds: [sourceSection.id],
                questionnaireId: sourceQuestionnaires[0].id,
                position: {
                  sectionId: destinationSection.id,
                  index: 1,
                },
              },
            },
            refetchQueries: ["GetQuestionnaire"],
          });
        });
      });
    });
  });
});
