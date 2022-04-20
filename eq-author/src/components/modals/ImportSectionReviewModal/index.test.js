import React from "react";
import { render, screen } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import ImportQuestionReviewModal from ".";
import mockSections from "../../../tests/mocks/mockSections.json";

const mockQuestionnaire = {
  title: "Import sections",
};

const mockOnSelectSections = jest.fn();
const mockOnRemoveSingle = jest.fn();
const mockOnRemoveAll = jest.fn();
const mockOnSelectQuestions = jest.fn();

describe("Import sections review modal", () => {
  it("Should call onSelectSections when the sections button is clicked", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectSections={mockOnSelectSections}
        onSelectQuestions={mockOnSelectQuestions}
        startingSelectedSections={[]}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    expect(
      screen.queryByText(
        /Select individual questions or entire sections to be imported, you cannot choose both/
      )
    ).toBeTruthy();
    // Import button should be disabled when no questions selected
    expect(screen.getByText(/^Import$/)).toBeDisabled();

    expect(mockOnSelectSections.mock.calls.length).toBe(0);

    userEvent.click(
      screen.getByTestId("section-review-select-sections-button")
    );

    expect(mockOnSelectSections.mock.calls.length).toBe(1);
  });

  it("Should display the selected sections when there are some", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedSections={mockSections}
        onSelectsections={mockOnSelectSections}
        onSelectQuestions={mockOnSelectQuestions}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    expect(mockSections[0].displayName).toBe("Pets");
    expect(mockSections[1].displayName).toBe("Cars");

    expect(screen.getByText(mockSections[0].displayName)).toBeInTheDocument();
    expect(screen.getByText(mockSections[1].displayName)).toBeInTheDocument();
  });

  it("Should call onRemoveSingle with the index of the item that is signaled to be removed", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedSections={mockSections}
        onSelectSections={mockOnSelectSections}
        onSelectQuestions={mockOnSelectQuestions}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    userEvent.click(screen.getAllByText(/✕/)[0]);
    expect(mockOnRemoveSingle).toHaveBeenCalledTimes(1);
    expect(mockOnRemoveSingle).toHaveBeenCalledWith(0);
  });

  it("Should delete all items", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedSections={mockSections}
        onSelectSections={mockOnSelectSections}
        onSelectQuestions={mockOnSelectQuestions}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    userEvent.click(screen.getByText(/Remove all/));
    expect(mockOnRemoveAll).toHaveBeenCalledTimes(1);
  });

  it("Should pass on selected sections when user confirms import", () => {
    const mockHandleConfirm = jest.fn();

    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectSections={mockOnSelectSections}
        onSelectQuestions={mockOnSelectQuestions}
        startingSelectedSections={mockSections}
        onConfirm={mockHandleConfirm}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    // Import button enabled / clickable when questions selected
    userEvent.click(screen.queryByText(/^Import$/));

    expect(mockHandleConfirm).toHaveBeenCalledWith(mockSections);
  });

  describe("Questions button", () => {
    it("Should render questions button if no sections are selected", () => {
      const mockHandleConfirm = jest.fn();

      render(
        <ImportQuestionReviewModal
          questionnaire={mockQuestionnaire}
          isOpen
          onSelectSections={mockOnSelectSections}
          onSelectQuestions={mockOnSelectQuestions}
          startingSelectedSections={[]}
          onConfirm={mockHandleConfirm}
          onCancel={jest.fn()}
          onBack={jest.fn()}
          onRemoveAll={mockOnRemoveAll}
          onRemoveSingle={mockOnRemoveSingle}
        />
      );

      expect(
        screen.queryByTestId("section-review-select-questions-button")
      ).toBeTruthy();
    });

    it("Should not render questions button if sections are selected", () => {
      const mockHandleConfirm = jest.fn();

      render(
        <ImportQuestionReviewModal
          questionnaire={mockQuestionnaire}
          isOpen
          onSelectSections={mockOnSelectSections}
          onSelectQuestions={mockOnSelectQuestions}
          startingSelectedSections={mockSections}
          onConfirm={mockHandleConfirm}
          onCancel={jest.fn()}
          onBack={jest.fn()}
          onRemoveAll={mockOnRemoveAll}
          onRemoveSingle={mockOnRemoveSingle}
        />
      );

      expect(
        screen.queryByTestId("section-review-select-questions-button")
      ).toBeFalsy();
    });

    it("Should call onSelectQuestions when questions button is clicked", () => {
      const mockHandleConfirm = jest.fn();

      render(
        <ImportQuestionReviewModal
          questionnaire={mockQuestionnaire}
          isOpen
          onSelectSections={mockOnSelectSections}
          onSelectQuestions={mockOnSelectQuestions}
          startingSelectedSections={[]}
          onConfirm={mockHandleConfirm}
          onCancel={jest.fn()}
          onBack={jest.fn()}
          onRemoveAll={mockOnRemoveAll}
          onRemoveSingle={mockOnRemoveSingle}
        />
      );

      expect(mockOnSelectQuestions.mock.calls.length).toBe(0);

      userEvent.click(
        screen.getByTestId("section-review-select-questions-button")
      );

      expect(mockOnSelectQuestions.mock.calls.length).toBe(1);
    });
  });
});
