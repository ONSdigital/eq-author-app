import React from "react";
import { render } from "tests/utils/rtl";

import Answers from "./Answers";

describe("Answers", () => {
  let mockPage, mockOnUpdateCalculatedSummaryPage, mockOnSelect;

  beforeEach(() => {
    mockPage = {
      section: {
        displayName: "Dina",
      },
      summaryAnswers: [
        {
          id: 1,
          type: "Number",
          displayName: "How many birds does Dina have?",
          properties: { required: false },
        },
        {
          id: 2,
          type: "Number",
          displayName: "How many years has she worked at Cloud Nine?",
          properties: { required: false },
        },
      ],
      validationErrorInfo: {
        errors: [],
      },
    };

    mockOnUpdateCalculatedSummaryPage = jest.fn();

    mockOnSelect = jest.fn();
  });
  it("Can render", () => {
    const { getByText } = render(
      <Answers
        page={mockPage}
        onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        onSelect={mockOnSelect}
      />
    );

    const title = getByText("Number answers in Dina");
    expect(title).toBeInTheDocument();

    const removeAllBtn = getByText("Remove all");
    expect(removeAllBtn).toBeInTheDocument();

    const ansOne = getByText("How many birds does Dina have?");
    expect(ansOne).toBeInTheDocument();

    const ansTwo = getByText("How many years has she worked at Cloud Nine?");
    expect(ansTwo).toBeInTheDocument();

    const selectBtn = getByText("Select another number answer");
    expect(selectBtn).toBeInTheDocument();
  });

  it("Calls onSelect when the select button is pressed", () => {
    const { getByText } = render(
      <Answers
        page={mockPage}
        onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        onSelect={mockOnSelect}
      />
    );

    const selectBtn = getByText("Select another number answer");

    selectBtn.click();

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("Calls onUpdateCalculatedSummaryPage when the remove all btn is pressed", () => {
    const { getByText } = render(
      <Answers
        page={mockPage}
        onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        onSelect={mockOnSelect}
      />
    );

    const removeAllBtn = getByText("Remove all");

    removeAllBtn.click();

    expect(mockOnUpdateCalculatedSummaryPage).toHaveBeenCalledTimes(1);
  });

  it("Calls onUpdateCalculatedSummaryPage when the remove single btn is pressed", () => {
    const { getAllByTestId } = render(
      <Answers
        page={mockPage}
        onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        onSelect={mockOnSelect}
      />
    );

    const removeOneBtn = getAllByTestId("remove-answer-button")[0];

    removeOneBtn.click();

    expect(mockOnUpdateCalculatedSummaryPage).toHaveBeenCalledTimes(1);
  });

  it("Can display an error", () => {
    mockPage.summaryAnswers = [
      {
        id: 1,
        displayName: "How many children does Glenn have?",
        type: "Number",
        properties: { required: false },
      },
    ];

    const { getByText } = render(
      <Answers
        page={mockPage}
        onUpdateCalculatedSummaryPage={mockOnUpdateCalculatedSummaryPage}
        onSelect={mockOnSelect}
      />
    );

    const errorMessage = getByText("Select another number answer");

    expect(errorMessage).toBeInTheDocument();
  });
});
