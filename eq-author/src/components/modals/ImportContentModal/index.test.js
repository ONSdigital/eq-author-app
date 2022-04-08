import React from "react";
import { render, screen } from "tests/utils/rtl";
import ImportContentModal from ".";

const mockQuestionnaire = {
  title: "Important Questions",
};

const mockOnSelectQuestions = jest.fn();
const mockOnSelectSections = jest.fn();
const mockOnRemoveSingle = jest.fn();
const mockOnRemoveAll = jest.fn();

describe("Import content modal", () => {
  it("should render", () => {
    render(
      <ImportContentModal
        questionnaire={mockQuestionnaire}
        isOpen
        onSelectQuestions={mockOnSelectQuestions}
        onSelectSections={mockOnSelectSections}
        startingSelectedQuestions={[]}
        onConfirm={jest.fn()}
        onCancel={jest.fn()}
        onBack={jest.fn()}
        onRemoveAll={mockOnRemoveAll}
        onRemoveSingle={mockOnRemoveSingle}
      />
    );

    expect(screen.queryByText(/Import content from/)).toBeTruthy();
    // Import button should be disabled when no questions selected
    expect(screen.getByText(/^Import$/)).toBeDisabled();
  });
});
