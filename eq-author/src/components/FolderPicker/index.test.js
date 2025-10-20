import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import FolderPicker from "./";

const sections = [
  {
    id: "section-1",
    title: "Section 1",
    displayName: "Section 1",
    folders: [
      {
        id: "folder-1",
        alias: "Folder 1",
      },
      {
        id: "folder-2",
        alias: "Folder 2",
      },
    ],
  },
  {
    id: "section-2",
    title: "Section 2",
    displayName: "Section 2",
    folders: [
      {
        id: "list-collector-1",
        title: "List collector 1",
        listId: "list-1",
      },
      {
        id: "list-collector-2",
        title: "List collector 2",
        alias: "List 2",
        listId: "list-2",
      },
      {
        id: "untitled-folder",
        displayName: "Untitled folder",
      },
    ],
  },
];

describe("FolderPicker", () => {
  const defaultProps = {
    title: "Select the folder(s) to import",
    isOpen: true,
    showSearch: true,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onCancel: jest.fn(),
    startingSelectedFolders: [],
    sections,
  };

  const renderFolderPicker = (args) => {
    return render(<FolderPicker {...defaultProps} {...args} />);
  };

  it("should render", () => {
    const { getByTestId } = renderFolderPicker();

    expect(getByTestId("folder-picker-header")).toBeInTheDocument();
  });

  it("should call onSubmit when select button is clicked", () => {
    const { getByTestId, getByText } = renderFolderPicker();

    fireEvent.click(getByText(/Folder 1/));

    const selectButton = getByTestId("folder-picker-button-select");
    fireEvent.click(selectButton);

    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel when cancel button is clicked", () => {
    const { getByTestId } = renderFolderPicker();

    const cancelButton = getByTestId("folder-picker-button-cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it("should render warning message", () => {
    const { getByText } = renderFolderPicker({
      warningMessage: "Test message",
    });

    expect(getByText("Test message")).toBeInTheDocument();
  });

  it("should update folder selected when clicked", () => {
    const { getByTestId } = renderFolderPicker();

    const folderItem = getByTestId("folder-picker-item-folder-1");
    fireEvent.click(folderItem);

    expect(folderItem.getAttribute("aria-selected")).toBe("true");

    fireEvent.click(folderItem);
    expect(folderItem.getAttribute("aria-selected")).toBe("false");
  });

  describe("Search bar", () => {
    it("should filter folders by search term", () => {
      const { getByTestId, queryByText } = renderFolderPicker();

      const searchBar = getByTestId("search-bar");
      fireEvent.change(searchBar, { target: { value: "Folder 1" } });

      expect(queryByText("Folder 1")).toBeInTheDocument();
      expect(queryByText("Folder 2")).not.toBeInTheDocument();
    });

    it("should display no results message when no folders match search term", () => {
      const { getByTestId, getByText } = renderFolderPicker();

      const searchBar = getByTestId("search-bar");
      fireEvent.change(searchBar, { target: { value: "Undefined folder" } });

      expect(
        getByText(/No results found for 'Undefined folder'/)
      ).toBeInTheDocument();
      expect(getByText(/Please check the folder exists/)).toBeInTheDocument();
    });
  });
});
