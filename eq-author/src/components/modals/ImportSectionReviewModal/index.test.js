import React from "react";
import { render, screen } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import ImportQuestionReviewModal from ".";
import mockSections from "../../../tests/mocks/mockSections.json";

const mockQuestionnaire = {
  title: "Important Questions",
};

// const mockQuestions = [
//   { alias: "Q1", title: "How many roads must a man walk down?" },
//   { alias: "Q2", title: "What is the airspeed velocity of a swallow?" },
//   { alias: "Q3", title: "What is your favourite colour?" },
// ];

const mockOnSelectSections = jest.fn();
const mockOnRemoveSingle = jest.fn();
const mockOnRemoveAll = jest.fn();

describe("Import sections review modal", () => {
  it("Should call onSelectSections when the button is clicked", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectSections={mockOnSelectSections}
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

    userEvent.click(screen.getByTestId("select-sections-button"));

    expect(mockOnSelectSections.mock.calls.length).toBe(1);
  });

  it("Should display the selected sections when there are some", () => {
    render(
      <ImportQuestionReviewModal
        questionnaire={mockQuestionnaire}
        isOpen
        startingSelectedSections={mockSections}
        onSelectsections={mockOnSelectSections}
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
});
