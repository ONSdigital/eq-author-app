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
});
