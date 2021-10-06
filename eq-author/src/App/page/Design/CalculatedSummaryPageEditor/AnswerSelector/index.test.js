import React from "react";
import { render } from "tests/utils/rtl";

import AnswerSelector from "./index";

import * as questionnaireContext from "components/QuestionnaireContext";

import mockQuestionnaire from "./mockQuestionnaire.json";
import mockPage from "./mockPage.json";

describe("Answer selector", () => {
  let mockOnUpdateCalculatedSummaryPage, mockUseQuestionnaire;

  beforeEach(() => {
    mockOnUpdateCalculatedSummaryPage = jest.fn();

    mockUseQuestionnaire = jest.fn(() => ({
      questionnaire: mockQuestionnaire,
    }));

    questionnaireContext.useQuestionnaire = mockUseQuestionnaire;
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

      const emptyLabel = getByText("No answers selected");
      expect(emptyLabel).toBeInTheDocument();
    });

    it("Shows the picker when the select button is pressed", () => {
      const { getByText } = render(() => (
        <AnswerSelector
          page={mockPage}
          onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        />
      ));

      const btn = getByText("Select an answer");

      expect(btn).not.toBeDisabled();
      btn.click();

      const pickerHeader = getByText("Select one or more answer");
      expect(pickerHeader).toBeInTheDocument();
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
      const { getByText } = render(() => (
        <AnswerSelector
          page={mockPage}
          onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        />
      ));

      const btn = getByText("Select another number answer");

      expect(btn).not.toBeDisabled();
      btn.click();

      const pickerHeader = getByText("Select one or more answer");
      expect(pickerHeader).toBeInTheDocument();
    });
  });
});
