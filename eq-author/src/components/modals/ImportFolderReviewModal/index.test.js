import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import ImportFolderReviewModal from ".";

const mockQuestionnaire = {
  title: "Import folders",
};

describe("Import folder review modal", () => {
  const defaultProps = {
    questionnaire: mockQuestionnaire,
    isOpen: true,
    startingSelectedFolders: [],
    onSelectSections: jest.fn(),
    onSelectFolders: jest.fn(),
    onSelectQuestions: jest.fn(),
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
    onBack: jest.fn(),
    onRemoveAll: jest.fn(),
    onRemoveSingle: jest.fn(),
  };

  const renderImportFolderReviewModal = (args) => {
    return render(<ImportFolderReviewModal {...defaultProps} {...args} />);
  };

  it("should render", () => {
    const { getByText } = renderImportFolderReviewModal();

    expect(
      getByText(/Select sections, folders or questions to import/)
    ).toBeTruthy();
  });

  it("should call onSelectFolders when the folders button is clicked", () => {
    const { getByTestId } = renderImportFolderReviewModal();

    expect(defaultProps.onSelectFolders).not.toHaveBeenCalled();

    fireEvent.click(getByTestId("folder-review-select-folders-button"));

    expect(defaultProps.onSelectFolders).toHaveBeenCalledTimes(1);
  });

  it("should render selected folders", () => {
    const startingSelectedFolders = [
      { id: "folder-1", displayName: "Folder 1 display name" },
      { id: "folder-2", title: "Folder 2 title", alias: "Folder 2 alias" },
    ];
    const { getByText } = renderImportFolderReviewModal({
      startingSelectedFolders,
    });

    expect(getByText(/Folder 1 display name/)).toBeInTheDocument();
    expect(getByText(/Folder 2 title/)).toBeInTheDocument();
    expect(getByText(/Folder 2 alias/)).toBeInTheDocument();
  });

  it("should call onConfirm when import button is clicked", () => {
    const startingSelectedFolders = [
      { id: "folder-1", displayName: "Folder 1" },
    ];
    const { getByText } = renderImportFolderReviewModal({
      startingSelectedFolders,
    });

    const importButton = getByText(/^Import$/); // Matches exact "Import" text - gets import button

    expect(defaultProps.onConfirm).not.toHaveBeenCalled();

    fireEvent.click(importButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("should call onRemoveSingle when folder item remove button is clicked", () => {
    const startingSelectedFolders = [
      { id: "folder-1", displayName: "Folder 1" },
      { id: "folder-2", displayName: "Folder 2" },
    ];

    const { getByTestId } = renderImportFolderReviewModal({
      startingSelectedFolders,
    });

    expect(defaultProps.onRemoveSingle).not.toHaveBeenCalled();

    fireEvent.click(getByTestId("folder-review-item-remove-button-folder-1"));

    expect(defaultProps.onRemoveSingle).toHaveBeenCalledWith(0);
    expect(defaultProps.onRemoveSingle).toHaveBeenCalledTimes(1);
  });
});
