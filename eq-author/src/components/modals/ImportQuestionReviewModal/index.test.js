import React from "react";
import { render, screen } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import ImportQuestionReviewModal from ".";

const mockQuestionnaire = {
  title: "Important Questions",
};

const mockQuestions = [
  { alias: "Q1", title: "How many roads must a man walk down?" },
  { alias: "Q2", title: "What is the airspeed velocity of a swallow?" },
  { alias: "Q3", title: "What is your favourite colour?" },
];

const mockOnSelectQuestions = jest.fn();
const mockOnRemoveSingle = jest.fn();
const mockOnRemoveAll = jest.fn();
const mockOnSelectSections = jest.fn();

describe("Import questions review modal", () => {
  it("Should call onSelectQuestions when the button is clicked", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectQuestions={mockOnSelectQuestions}
        startingSelectedQuestions={[]}
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

    userEvent.click(
      screen.queryByTestId("question-review-select-questions-button")
    );

    expect(mockOnSelectQuestions.mock.calls.length).toBe(1);
  });

  it("Should display the selected questions when there are some", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedQuestions={mockQuestions}
        onSelectQuestions={mockOnSelectQuestions}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    expect(screen.getByText(mockQuestions[0].title)).toBeTruthy();
  });

  it("Should call onRemoveSingle with the index of the item that is signaled to be removed", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedQuestions={mockQuestions}
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

  it("Should be able to delete all items", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedQuestions={mockQuestions}
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

  it("Should pass on selected questions when user confirms import", () => {
    const mockHandleConfirm = jest.fn();

    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectQuestions={mockOnSelectQuestions}
        startingSelectedQuestions={mockQuestions}
        onConfirm={mockHandleConfirm}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    // Import button enabled / clickable when questions selected
    userEvent.click(screen.queryByText(/^Import$/));

    expect(mockHandleConfirm).toHaveBeenCalledWith(mockQuestions);
  });

  describe("Sections button", () => {
    it("Should render sections button if no questions are selected", () => {
      render(
        <ImportQuestionReviewModal
          questionnaire={mockQuestionnaire}
          isOpen
          onSelectSections={mockOnSelectSections}
          onSelectQuestions={mockOnSelectQuestions}
          startingSelectedQuestions={[]}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
          onBack={jest.fn()}
          onRemoveAll={mockOnRemoveAll}
          onRemoveSingle={mockOnRemoveSingle}
        />
      );

      expect(
        screen.queryByTestId("question-review-select-sections-button")
      ).toBeTruthy();
    });

    it("Should not render sections button if questions are selected", () => {
      render(
        <ImportQuestionReviewModal
          questionnaire={mockQuestionnaire}
          isOpen
          onSelectSections={mockOnSelectSections}
          onSelectQuestions={mockOnSelectQuestions}
          startingSelectedQuestions={mockQuestions}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
          onBack={jest.fn()}
          onRemoveAll={mockOnRemoveAll}
          onRemoveSingle={mockOnRemoveSingle}
        />
      );

      expect(
        screen.queryByTestId("section-review-select-sections-button")
      ).toBeFalsy();
    });

    it("Should call onSelectSections when sections button is clicked", () => {
      render(
        <ImportQuestionReviewModal
          questionnaire={mockQuestionnaire}
          isOpen
          onSelectSections={mockOnSelectSections}
          onSelectQuestions={mockOnSelectQuestions}
          startingSelectedQuestions={[]}
          onConfirm={jest.fn()}
          onCancel={jest.fn()}
          onBack={jest.fn()}
          onRemoveAll={mockOnRemoveAll}
          onRemoveSingle={mockOnRemoveSingle}
        />
      );

      expect(mockOnSelectSections.mock.calls.length).toBe(0);

      userEvent.click(
        screen.getByTestId("question-review-select-sections-button")
      );

      expect(mockOnSelectSections.mock.calls.length).toBe(1);
    });
  });
});
