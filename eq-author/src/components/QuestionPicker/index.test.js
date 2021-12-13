import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import QuestionPicker from ".";
import mockSections from "../../tests/mocks/mockSections.json";

describe("QuestionPicker", () => {
  const defaultProps = {
    title: "Select the question(s) to import",
    isOpen: true,
    showSearch: true,
    warningPanel:
      "You cannot import folders but you can import any questions they contain.",
    onSubmit: jest.fn(),
    onClose: jest.fn(),
    onCancel: jest.fn(),
    startingSelectedQuestions: [],
    sections: mockSections,
  };

  const renderQuestionPicker = (args) =>
    render(<QuestionPicker isOpen {...defaultProps} {...args} />);

  describe("Testing the render", () => {
    it("Can render", () => {
      const { getByText } = renderQuestionPicker({});

      expect(getByText(defaultProps.title)).toBeInTheDocument();
    });
  });

  describe("Functions Firing", () => {
    it("onSubmit Fires", () => {
      const { getByText } = renderQuestionPicker({});

      const selectButton = getByText("Select");

      const firstQuestion = getByText("1a").closest("div");

      fireEvent.click(firstQuestion);
      fireEvent.click(selectButton);

      expect(defaultProps.onSubmit).toHaveBeenCalled();
    });

    it("onClose Fires", () => {
      const { getByLabelText } = renderQuestionPicker({});

      const closeButton = getByLabelText("Close");

      fireEvent.click(closeButton);

      // getByLabelText can also grab the aria label
      expect(defaultProps.onClose).toHaveBeenCalled();
    });
  });

  describe("Interaction testing", () => {
    it("tests clicks on individual questions and registers the clicks", () => {
      const { getByText } = renderQuestionPicker({});

      const firstQuestion = getByText("1a").closest("div");
      fireEvent.click(firstQuestion);

      expect(firstQuestion.getAttribute("aria-selected")).toBe("true");

      fireEvent.click(firstQuestion);
      expect(firstQuestion.getAttribute("aria-selected")).toBe("false");
    });
  });

  describe("Testing the search UI", () => {
    it("Types pet into the search bar and returns the question Why do you not have pets?", () => {
      const { getByText, getByTestId, queryByText } = renderQuestionPicker({});

      const searchBar = getByTestId("search-bar");

      fireEvent.change(searchBar, {
        target: { value: "pet" },
      });

      expect(getByText("Why do you not have any pets?")).toBeInTheDocument();
      expect(queryByText("Do you have a car?")).not.toBeInTheDocument();
    });

    it("Types car into the search bar and returns the question Do you have a car && what colour car do you have?", () => {
      const { getByText, getByTestId, queryByText } = renderQuestionPicker({});

      const searchBar = getByTestId("search-bar");

      fireEvent.change(searchBar, {
        target: { value: "car" },
      });

      expect(getByText("Do you have a car?")).toBeInTheDocument();
      expect(getByText("What colour car do you have?")).toBeInTheDocument();
      expect(
        queryByText("Why do you not have any pets?")
      ).not.toBeInTheDocument();
    });

    it("Doesnt show the search bar if showSearch is false", () => {
      const defaultPropsWithSearchFalse = {
        title: "Select the question(s) to import",
        isOpen: true,
        showSearch: false,
        warningPanel:
          "You cannot import folders but you can import any questions they contain.",
        onSubmit: jest.fn(),
        onClose: jest.fn(),
        onCancel: jest.fn(),
        startingSelectedQuestions: [],
        sections: mockSections,
      };

      const renderQuestionPicker = (args) =>
        render(
          <QuestionPicker isOpen {...defaultPropsWithSearchFalse} {...args} />
        );

      const { queryByTestId } = renderQuestionPicker({});
      const searchBar = queryByTestId("search-bar");

      expect(searchBar).toBeNull();
    });
  });
});
