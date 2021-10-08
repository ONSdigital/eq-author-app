import React from "react";
import { render } from "tests/utils/rtl";

import Empty from "./Empty";

describe("Empty state", () => {
  let mockPage, mockAvailableSummaryAnswers;
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    mockPage = {
      id: "1",
      validationErrorInfo: {
        errors: [{ errorCode: "ERR_NO_ANSWERS" }],
      },
    };

    mockAvailableSummaryAnswers = [];
  });

  it("Can render", () => {
    const { getByText } = render(
      <Empty
        page={mockPage}
        availableSummaryAnswers={mockAvailableSummaryAnswers}
        onSelect={mockOnSelect}
      />
    );

    const title = getByText("No answers available");
    expect(title).toBeInTheDocument();

    const phrase = getByText(
      "There are no answers to provide a calculated summary."
    );
    expect(phrase).toBeInTheDocument();

    const selectBtn = getByText("Select an answer");
    expect(selectBtn).toBeInTheDocument();

    const errorMsg = getByText("Select at least two answers to be calculated");
    expect(errorMsg).toBeInTheDocument();
  });

  it("Calls the onSelect function when the btn is pressed", () => {
    const { getByText } = render(
      <Empty
        page={mockPage}
        availableSummaryAnswers={[{ id: 1 }]}
        onSelect={mockOnSelect}
      />
    );

    const btn = getByText("Select an answer");

    btn.click();

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
  });

  it("Disables the select button when there is no available answers", () => {
    const { getByText } = render(
      <Empty
        page={mockPage}
        availableSummaryAnswers={mockAvailableSummaryAnswers}
        onSelect={mockOnSelect}
      />
    );

    const btn = getByText("Select an answer");

    expect(btn).toBeDisabled();
  });

  it("Changes the phrase if there are answers available", () => {
    const { getByText } = render(
      <Empty
        page={mockPage}
        availableSummaryAnswers={[{ id: 1 }]}
        onSelect={mockOnSelect}
      />
    );

    const phrase = getByText("Select an answer using the button below.");
    expect(phrase).toBeInTheDocument();
  });
});
