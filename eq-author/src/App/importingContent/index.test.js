import React from "react";
import ImportingContent from "./";
import { render, fireEvent } from "tests/utils/rtl";
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
    title: "Source questionnaire",
  },
];

const setImportingContent = jest.fn();

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
  data: { sourceQuestionnaires },
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
});
