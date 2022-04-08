import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import SectionPicker from ".";
import mockSections from "../../tests/mocks/mockSections.json";

describe.only("SectionPicker", () => {
  const defaultProps = {
    title: "Select the section(s) to import",
    isOpen: true,
    showSearch: true,
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onCancel: jest.fn(),
    startingSelectedSections: [],
    sections: mockSections,
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

  //   describe("Interaction testing", () => {
  //     it("tests clicks on individual questions and registers the clicks", () => {
  //       const { getByText } = renderSectionPicker({});

  //       const firstQuestion = getByText("1a").closest("div");
  //       fireEvent.click(firstQuestion);

  //       expect(firstQuestion.getAttribute("aria-selected")).toBe("true");

  //       fireEvent.click(firstQuestion);
  //       expect(firstQuestion.getAttribute("aria-selected")).toBe("false");
  //     });
  //   });

  //   describe("Testing the search UI", () => {
  //     it("Types pet into the search bar and returns the question Why do you not have pets?", () => {
  //       const { getByText, getByTestId, queryByText } = renderSectionPicker({});

  //       const searchBar = getByTestId("search-bar");

  //       fireEvent.change(searchBar, {
  //         target: { value: "pet" },
  //       });

  //       expect(getByText("Why do you not have any pets?")).toBeInTheDocument();
  //       expect(queryByText("Do you have a car?")).not.toBeInTheDocument();
  //     });

  //     it("Types car into the search bar and returns the question Do you have a car && what colour car do you have?", () => {
  //       const { getByText, getByTestId, queryByText } = renderSectionPicker({});

  //       const searchBar = getByTestId("search-bar");

  //       fireEvent.change(searchBar, {
  //         target: { value: "car" },
  //       });

  //       expect(getByText("Do you have a car?")).toBeInTheDocument();
  //       expect(getByText("What colour car do you have?")).toBeInTheDocument();
  //       expect(
  //         queryByText("Why do you not have any pets?")
  //       ).not.toBeInTheDocument();
  //     });

  //     it("Doesnt show the search bar if showSearch is false", () => {
  //       const defaultPropsWithSearchFalse = {
  //         title: "Select the question(s) to import",
  //         isOpen: true,
  //         showSearch: false,
  //         warningPanel:
  //           "You cannot import folders but you can import any questions they contain.",
  //         onSubmit: jest.fn(),
  //         onClose: jest.fn(),
  //         onCancel: jest.fn(),
  //         startingSelectedQuestions: [],
  //         sections: mockSections,
  //       };

  //       const renderSectionPicker = (args) =>
  //         render(
  //           <SectionPicker isOpen {...defaultPropsWithSearchFalse} {...args} />
  //         );

  //       const { queryByTestId } = renderSectionPicker({});
  //       const searchBar = queryByTestId("search-bar");

  //       expect(searchBar).toBeNull();
  //     });
  //   });
});
