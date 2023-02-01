import React from "react";
import ImportingContent from "./";
import { render, screen } from "tests/utils/rtl";
import { useMutation, useQuery } from "@apollo/react-hooks";
import QuestionnaireContext from "components/QuestionnaireContext";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));
useQuery.mockImplementation(jest.fn(() => [jest.fn()]));

describe("Importing content", () => {
  it("should render ImportingContent modal", () => {
    const sourceQuestionnaires = [
      {
        id: "16b650e8-b7cd-4490-8f65-c7631e03bf95",
        title: "MC",
        __typename: "Questionnaire",
      },
    ];

    const setImportingContent = jest.fn();
    const destinationQuestionnaire = buildQuestionnaire({ answerCount: 1 });

    const renderImportingContent = (props) =>
      render(
        <QuestionnaireContext.Provider
          value={destinationQuestionnaire}
          {...props}
        >
          <ImportingContent
            questionnaires={sourceQuestionnaires}
            stopImporting={() => setImportingContent(false)}
            targetInsideFolder
            {...props}
          />
        </QuestionnaireContext.Provider>
      );

    const { getByTestId } = renderImportingContent();
    screen.debug();

    //expect(getByTestId("questionnaire-select-modal")).toBeInTheDocument();
    expect(screen.queryByText(/Select the source questionnaire/)).toBeTruthy();
  });
});
