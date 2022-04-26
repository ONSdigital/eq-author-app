import React from "react";
import { render, screen } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";

import ImportContentModal from ".";

const mockQuestionnaire = {
  title: "Important Questions",
};

const mockOnSelectQuestions = jest.fn();
const mockOnSelectSections = jest.fn();
const mockOnRemoveSingle = jest.fn();
const mockOnRemoveAll = jest.fn();
const mockOnCancel = jest.fn();
const mockOnBack = jest.fn();

const setup = (props) =>
  render(
    <ImportContentModal
      questionnaire={mockQuestionnaire}
      isOpen
      onSelectQuestions={mockOnSelectQuestions}
      onSelectSections={mockOnSelectSections}
      startingSelectedQuestions={[]}
      onConfirm={jest.fn()}
      onCancel={mockOnCancel}
      onBack={mockOnBack}
      onRemoveAll={mockOnRemoveAll}
      onRemoveSingle={mockOnRemoveSingle}
      {...props}
    />
  );

describe("Import content modal", () => {
  it("should render", () => {
    setup();

    expect(screen.queryByText(/Import content from/)).toBeTruthy();
    // Import button should be disabled when no questions selected
    expect(screen.getByText(/^Import$/)).toBeDisabled();
  });

  it("should call onSelectSections when the sections button is clicked", () => {
    setup();

    expect(mockOnSelectSections.mock.calls.length).toBe(0);

    userEvent.click(screen.getByTestId("content-modal-select-sections-button"));

    expect(mockOnSelectSections.mock.calls.length).toBe(1);
  });

  it("should call onSelectQuestions when the questions button is clicked", () => {
    setup();

    expect(mockOnSelectQuestions.mock.calls.length).toBe(0);

    userEvent.click(
      screen.getByTestId("content-modal-select-questions-button")
    );

    expect(mockOnSelectQuestions.mock.calls.length).toBe(1);
  });

  it("should call onClose when the close button is clicked", () => {
    setup();

    expect(mockOnCancel.mock.calls.length).toBe(0);

    userEvent.click(screen.getByText(/Cancel/));

    expect(mockOnCancel.mock.calls.length).toBe(1);
  });

  it("should call onBack when the back button is clicked", () => {
    setup();

    expect(mockOnBack.mock.calls.length).toBe(0);

    userEvent.click(screen.getByText(/Back/));

    expect(mockOnBack.mock.calls.length).toBe(1);
  });
});
