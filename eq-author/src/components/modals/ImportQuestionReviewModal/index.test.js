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

const mockHandleSelectQuestions = jest.fn((_questionnaire, callback) =>
  callback(mockQuestions)
);

describe("Import questions review modal", () => {
  it("should allow selecting and removing questions", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectQuestions={mockHandleSelectQuestions}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
      />
    );

    expect(screen.queryByText(/No questions selected/)).toBeTruthy();
    // Import button should be disabled when no questions selected
    expect(screen.getByText(/^Import$/)).toBeDisabled();

    userEvent.click(screen.queryByText(/Select questions/));

    // All questions should now be present
    expect(screen.queryByText(/Questions to import/)).toBeTruthy();
    mockQuestions.forEach((q) =>
      expect(screen.queryByText(q.title)).toBeTruthy()
    );

    // Can delete an item
    userEvent.click(screen.getAllByText(/✕/)[0]);
    expect(screen.queryByText(mockQuestions[0].title)).toBeFalsy();
    expect(screen.queryByText(mockQuestions[1].title)).toBeTruthy();

    // Can delete all items
    userEvent.click(screen.getByText(/Remove all/));
    mockQuestions.forEach((q) =>
      expect(screen.queryByText(q.title)).toBeFalsy()
    );
  });

  it("Should pass on selected questions when user confirms import", () => {
    const mockHandleConfirm = jest.fn();

    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectQuestions={mockHandleSelectQuestions}
        onConfirm={mockHandleConfirm}
        onCancel={jest.fn()}
        onBack={jest.fn()}
      />
    );

    userEvent.click(screen.queryByText(/Select questions/));

    // Import button enabled / clickable when questions selected
    userEvent.click(screen.queryByText(/^Import$/));

    expect(mockHandleConfirm).toHaveBeenCalledWith(mockQuestions);
  });
});
