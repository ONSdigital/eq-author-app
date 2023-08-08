import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import AnswerPicker from "./AnswerPicker";

describe("Content Picker Answer Picker", () => {
  let props;

  const renderAnswerPicker = () => render(<AnswerPicker {...props} />);

  const section1 = {
    id: "sec1",
    displayName: "section 1",
    folders: [
      {
        pages: [
          {
            id: "Page 1",
            displayName: "Page 1",
            answers: [
              {
                id: "Percentage 1",
                displayName: "Percentage 1",
                type: "Percentage",
              },
            ],
          },
        ],
      },
    ],
  };

  const section2 = {
    id: "sec2",
    displayName: "section 2",
    folders: [
      {
        pages: [
          {
            id: "Page 2-1",
            displayName: "Page 2-1",
            answers: [
              {
                id: "Percentage 2",
                displayName: "Percentage 2",
                type: "Percentage",
              },
              {
                id: "Hello 1",
                displayName: "Hello 1",
                type: "Hello 1",
              },
            ],
          },
        ],
      },
    ],
  };

  const section3 = {
    id: "sec3",
    displayName: "section 3",
    folders: [
      {
        pages: [
          {
            id: "Page 3-1",
            displayName: "Page 3-1",
            answers: [
              {
                id: "Percentage 3",
                displayName: "Percentage 3",
                type: "Percentage",
              },
              {
                id: "Hello 2",
                displayName: "Hello 2",
                type: "Hello 2",
              },
            ],
          },
        ],
      },
      {
        id: "folder-2",
        listId: "list-1",
        pages: [
          {
            id: "qualifier-1",
            displayName: "List collector qualifier page",
            pageType: "ListCollectorQualifierPage",
            answers: [
              {
                id: "qualifier-answer",
                type: "Radio",
                options: [
                  {
                    id: "qualifier-option-positive",
                    label: "Yes",
                  },
                  {
                    id: "qualifier-option-negative",
                    label: "No",
                  },
                ],
              },
            ],
          },
          {
            id: "add-item-1",
            displayName: "List collector add item page",
            pageType: "ListCollectorAddItemPage",
          },
          {
            id: "confirmation-1",
            displayName: "List collector confirmation page",
            pageType: "ListCollectorConfirmationPage",
            answers: [
              {
                id: "confirmation-answer",
                type: "Radio",
                options: [
                  {
                    id: "confirmation-option-positive",
                    label: "Yes",
                  },
                  {
                    id: "confirmation-option-negative",
                    label: "No",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        pages: [
          {
            id: "Page 4-1",
            displayName: "Page 4-1",
            answers: [
              {
                id: "Percentage 4",
                displayName: "Percentage 4",
                type: "Percentage",
              },
            ],
          },
        ],
      },
    ],
  };

  const expectFlatAnswerList = ({
    answerToggle,
    sectionToggle,
    section1Button,
  }) => {
    expect(answerToggle.checked).toBeTruthy();
    expect(sectionToggle.checked).toBeFalsy();
    expect(section1Button).not.toHaveAttribute("aria-selected");
  };

  const expectSectionAnswerList = ({
    answerToggle,
    sectionToggle,
    section1Button,
  }) => {
    expect(answerToggle.checked).toBeFalsy();
    expect(sectionToggle.checked).toBeTruthy();
    expect(section1Button).toHaveAttribute("aria-selected", "true");
  };

  beforeEach(() => {
    props = {
      data: [section1],
      contentTypes: [],
      isSelected: jest.fn(),
      onSelected: jest.fn(),
      isSectionSelected: jest.fn(),
    };
  });

  it("should render answer error message when no data supplied", () => {
    props.data = [];
    const { getByText, getByTestId } = renderAnswerPicker();

    expect(
      getByText("There are no previous answers to pick from")
    ).toBeTruthy();
    expect(getByTestId("no-previous-answers")).toBeTruthy();
  });

  it("should render section error message when no data supplied", () => {
    props.data = [];
    const { getByText, getByLabelText, getByTestId } = renderAnswerPicker();

    fireEvent.click(getByLabelText("Sections"));

    expect(
      getByText("There are no previous answers to pick from")
    ).toBeTruthy();
    expect(getByTestId("no-previous-answers")).toBeTruthy();
  });

  it("should render flat list of answers by default when only 1 section", () => {
    const { getByText, getByLabelText } = renderAnswerPicker();

    const answerToggle = getByLabelText("Answers");
    const sectionToggle = getByLabelText("Sections");
    const section1Button = getByText("section 1");

    expectFlatAnswerList({ answerToggle, sectionToggle, section1Button });
  });

  it("should render section list by default when more than 1 section", () => {
    props.data.push(section2);

    const { getByText, getByLabelText } = renderAnswerPicker();

    const answerToggle = getByLabelText("Answers");
    const sectionToggle = getByLabelText("Sections");
    const section1Button = getByText("section 1");

    expectSectionAnswerList({ answerToggle, sectionToggle, section1Button });
  });

  it("should render correct list type when selected", () => {
    const { getByText, getByLabelText } = renderAnswerPicker();

    const answerToggle = getByLabelText("Answers");
    const section1Button = getByText("section 1");
    const sectionToggle = getByLabelText("Sections");

    expectFlatAnswerList({ answerToggle, sectionToggle, section1Button });

    fireEvent.click(sectionToggle);
    const section1Button2 = getByText("section 1");

    expectSectionAnswerList({
      answerToggle,
      sectionToggle,
      section1Button: section1Button2,
    });
  });

  it("Types Percentage into the search bar and returns the answer", () => {
    const { getByText, queryByPlaceholderText, queryByText } =
      renderAnswerPicker({});

    const searchBar = queryByPlaceholderText("Search answers");

    fireEvent.change(searchBar, {
      target: { value: "Percentage" },
    });

    expect(getByText("Percentage 1")).toBeInTheDocument();
    expect(queryByText("Hello 1")).not.toBeInTheDocument();
  });

  it("should remove list collector page types from content picker", () => {
    props.data.push(section2);
    props.data.push(section3);
    const { queryByText, getByTestId, queryAllByText } = renderAnswerPicker();

    fireEvent.click(getByTestId("option-button-answers"));

    expect(queryByText("Page 1")).toBeInTheDocument();
    expect(queryByText("Percentage 1")).toBeInTheDocument();

    expect(queryAllByText("Page 2-1").length).toEqual(2);
    expect(queryByText("Percentage 2")).toBeInTheDocument();
    expect(queryByText("Hello 1")).toBeInTheDocument();

    expect(queryAllByText("Page 3-1").length).toEqual(2);
    expect(queryByText("Percentage 3")).toBeInTheDocument();
    expect(queryByText("Hello 2")).toBeInTheDocument();

    expect(
      queryByText("List collector qualifier page")
    ).not.toBeInTheDocument();
    expect(queryByText("List collector add item page")).not.toBeInTheDocument();
    expect(
      queryByText("List collector confirmation page")
    ).not.toBeInTheDocument();

    expect(queryByText("Page 4-1")).toBeInTheDocument();
    expect(queryByText("Percentage 4")).toBeInTheDocument();
  });
});
