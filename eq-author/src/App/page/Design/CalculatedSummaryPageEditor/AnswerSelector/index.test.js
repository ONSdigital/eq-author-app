import React from "react";
import { render } from "tests/utils/rtl";

import AnswerSelector from "./index";

import * as questionnaireContext from "components/QuestionnaireContext";

import mockQuestionnaire from "./mockQuestionnaire.json";
import mockPage from "./mockPage.json";

import mockCalculatedSummary from "tests/mocks/mockCalculatedSummary.json";

import suppressConsoleMessage from "tests/utils/supressConsol";

/*
 * @description Suppresses specific messages from being logged in the Console.
 */
suppressConsoleMessage(
  "Failed prop type: Invalid prop `children` supplied to `Provider`",
  "error"
);

// eslint-disable-next-line no-console
console.log(
  `Warn: there are manually suppressed warnings or errors in this test file due to dependencies needing updates - See EAR-1095`
);

describe("Answer selector", () => {
  let mockOnUpdateCalculatedSummaryPage, mockUseQuestionnaire;

  beforeEach(() => {
    mockOnUpdateCalculatedSummaryPage = jest.fn();

    mockUseQuestionnaire = jest.fn(() => ({
      questionnaire: mockQuestionnaire,
    }));

    questionnaireContext.useQuestionnaire = mockUseQuestionnaire; // eslint-disable-line import/namespace
  });

  describe("Empty state", () => {
    it("Shows the empty state when there are no selected answers", () => {
      const { getByText } = render(() => (
        <AnswerSelector
          page={mockPage}
          onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        />
      ));

      expect(mockPage.summaryAnswers).toHaveLength(0);

      const emptyLabel = getByText(
        "No answers or calculated summary totals selected"
      );
      expect(emptyLabel).toBeInTheDocument();
    });

    it("Shows the picker when the select button is pressed", () => {
      const { getByText, getAllByText } = render(() => (
        <AnswerSelector
          page={mockPage}
          onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        />
      ));

      const btn = getByText("Select an answer or calculated summary total");

      expect(btn).not.toBeDisabled();
      btn.click();

      const pickerHeader = getAllByText(
        "Select an answer or calculated summary total"
      );
      expect(pickerHeader).toBeTruthy();
    });
  });

  describe("Nonempty state", () => {
    beforeEach(() => {
      mockPage.summaryAnswers = [
        {
          id: "3a1633da-29d4-426e-9e7e-fd14d4c75700",
          displayName: "a",
          type: "Number",
          properties: {
            required: false,
            decimals: 0,
          },
          __typename: "BasicAnswer",
        },
        {
          id: "f337bce1-ad17-49ab-8439-5eb632177fcd",
          displayName: "b",
          type: "Number",
          properties: {
            required: false,
            decimals: 0,
          },
          __typename: "BasicAnswer",
        },
      ];
    });

    it("Displays the nonempty state when there are selected answers", () => {
      const { getByText } = render(() => (
        <AnswerSelector
          page={mockPage}
          onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        />
      ));

      expect(mockPage.summaryAnswers).toHaveLength(2);

      const nonemptyLabel = getByText("Number answers in Untitled section");
      expect(nonemptyLabel).toBeInTheDocument();
    });

    it("Shows the picker when the select button is pressed", () => {
      const { getByText, getAllByText } = render(() => (
        <AnswerSelector
          page={mockPage}
          onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        />
      ));

      const btn = getByText(
        "Select another number answer or calculated summary total"
      );

      expect(btn).not.toBeDisabled();
      btn.click();

      const pickerHeader = getAllByText(
        "Select an answer or calculated summary total"
      );
      expect(pickerHeader).toBeTruthy();
    });
  });
});

describe("Submit selected answers", () => {
  let mockOnUpdateCalculatedSummaryPage, mockUseQuestionnaire;

  beforeEach(() => {
    mockOnUpdateCalculatedSummaryPage = jest.fn();

    mockUseQuestionnaire = jest.fn(() => ({
      questionnaire: mockCalculatedSummary,
    }));

    questionnaireContext.useQuestionnaire = mockUseQuestionnaire; // eslint-disable-line import/namespace
  });

  it("should submit the selected answers", () => {
    const { getByText, getAllByText, getByTestId } = render(() => (
      <AnswerSelector
        page={mockCalculatedSummary.sections[1].folders[0].pages[2]}
        onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
      />
    ));

    const btn = getByText("Select an answer or calculated summary total");

    expect(btn).not.toBeDisabled();
    btn.click();

    const pickerHeader = getAllByText(
      "Select an answer or calculated summary total"
    );
    expect(pickerHeader).toBeTruthy();

    const calculatedSummaryAnswers = getAllByText("CALCULATED SUMMARY");
    expect(calculatedSummaryAnswers).toBeTruthy();
    calculatedSummaryAnswers[0].click();
    calculatedSummaryAnswers[1].click();

    const selectButton = getByTestId("select-summary-answers");
    expect(selectButton).toBeTruthy();

    selectButton.click();

    expect(mockOnUpdateCalculatedSummaryPage).toHaveBeenCalledTimes(1);
  });
});
