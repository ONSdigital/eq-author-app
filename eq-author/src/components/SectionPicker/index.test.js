import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import SectionPicker from ".";
import mockSections from "../../tests/mocks/mockSections.json";

describe("SectionPicker", () => {
  const defaultProps = {
    title: "Select the section(s) to import",
    isOpen: true,
    showSearch: true,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onCancel: jest.fn(),
    startingSelectedSections: [],
    sections: [
      ...mockSections,
      {
        id: "section3",
        title: "",
        displayName: "Pets 2",
      },
    ],
  };

  const renderSectionPicker = (args) =>
    render(<SectionPicker isOpen {...defaultProps} {...args} />);

  describe("Render", () => {
    it("Can render", () => {
      const { getByText } = renderSectionPicker({});

      expect(getByText(defaultProps.title)).toBeInTheDocument();
    });
  });

  describe("Functions Firing", () => {
    it("onSubmit Fires", () => {
      const { getByText } = renderSectionPicker({});

      const selectButton = getByText("Select");

      const firstSection = getByText("Pets").closest("div");

      fireEvent.click(firstSection);
      fireEvent.click(selectButton);

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    it("onClose Fires", () => {
      const { getByLabelText } = renderSectionPicker({});

      const closeButton = getByLabelText("Close");

      fireEvent.click(closeButton);

      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe("Interaction testing", () => {
    it("tests clicks on individual sections and registers the clicks", () => {
      const { getByText } = renderSectionPicker({});

      const firstSection = getByText("Pets").closest("div");
      fireEvent.click(firstSection);

      expect(firstSection.getAttribute("aria-selected")).toBe("true");

      fireEvent.click(firstSection);
      expect(firstSection.getAttribute("aria-selected")).toBe("false");
    });
  });

  describe("Testing the search UI", () => {
    it("Types pet into the search bar and returns the Pets section", () => {
      const { getByText, getByTestId, queryByText } = renderSectionPicker({});

      const searchBar = getByTestId("search-bar");

      fireEvent.change(searchBar, {
        target: { value: "pet" },
      });

      expect(getByText("Pets")).toBeInTheDocument();
      expect(queryByText("Cars")).not.toBeInTheDocument();
    });

    it("Types pet into the search bar and returns the sections Pets and Pets 2", () => {
      const { getByText, getByTestId, queryByText } = renderSectionPicker({});

      const searchBar = getByTestId("search-bar");

      fireEvent.change(searchBar, {
        target: { value: "pet" },
      });

      expect(queryByText("Cars")).not.toBeInTheDocument();
      expect(getByText("Pets")).toBeInTheDocument();
      expect(queryByText("Pets 2")).toBeInTheDocument();
    });

    it("Renders no results component if section is not found", () => {
      const { getByText, getByTestId, queryByText } = renderSectionPicker({});

      const searchBar = getByTestId("search-bar");

      fireEvent.change(searchBar, {
        target: { value: "house" },
      });

      expect(queryByText("Cars")).not.toBeInTheDocument();
      expect(queryByText("Pets")).not.toBeInTheDocument();
      expect(queryByText("Pets 2")).not.toBeInTheDocument();
      expect(getByText(/No results found for 'house'/)).toBeInTheDocument();
      expect(getByText(/Please check the section exists/)).toBeInTheDocument();
    });

    it("Does not show the search bar if showSearch is false", () => {
      const { queryByTestId } = renderSectionPicker({ showSearch: false });
      const searchBar = queryByTestId("search-bar");

      expect(searchBar).toBeNull();
    });
  });
});
