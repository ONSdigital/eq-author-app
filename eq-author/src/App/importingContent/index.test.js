import React from "react";
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
  },
];

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
  data: { questionnaires: sourceQuestionnaires },
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
});
