import React from "react";
import { useParams } from "react-router-dom";
import ImportingContent from "./";
import { render, fireEvent, screen } from "tests/utils/rtl";
import { useMutation, useQuery } from "@apollo/react-hooks";
import QuestionnaireContext from "components/QuestionnaireContext";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

const destinationQuestionnaire = buildQuestionnaire({ answerCount: 1 });

const sourceQuestionnaires = [
  {
    id: "source-questionnaire-id",
    title: "Source questionnaire 1",
    displayName: "Source questionnaire 1",
    updatedAt: "2023-01-31T15:13:50.350Z",
    createdAt: "2023-01-31T15:00:28.941Z",
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
        folders: [
          {
            id: "folder-1",
            pages: [
              {
                id: "page-1",
                title: "Page 1",
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

                answers: [
                  {
                    id: "answer-2",
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

// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useParams: () => ({
//     id: "page-1",
//   }),
//   //useRouteMatch: () => ({ url: '/company/company-id1/team/team-id1' }),
// }));

const setImportingContent = jest.fn();

// Fix for TypeError: rowRef.current.scrollIntoView is not a function
window.HTMLElement.prototype.scrollIntoView = jest.fn();

const renderImportingContent = (props) =>
  render(
    <QuestionnaireContext.Provider value={destinationQuestionnaire}>
      <ImportingContent
        questionnaires={sourceQuestionnaires}
        stopImporting={() => setImportingContent(false)}
        targetInsideFolder
        {...props}
      />
    </QuestionnaireContext.Provider>
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
  it("should render ImportingContent modal", () => {
    const { getByTestId } = renderImportingContent();

    expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
  });

  it("should close the modal", () => {
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

    it("should remove selected question page", () => {
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
        getByText(
          "*Select individual questions or entire sections to be imported, you cannot choose both*"
        )
      ).toBeInTheDocument();
    });
  });
});
