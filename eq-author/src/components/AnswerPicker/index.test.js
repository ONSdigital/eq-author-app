import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import QuestionPicker from "./";

describe("Question Picker", () => {
  let data, onClose, onSubmit, startingSelectedAnswers, title, showTypes, props;

  beforeEach(() => {
    onClose = jest.fn();
    onSubmit = jest.fn();
    startingSelectedAnswers = [];
    title = "Select one or more answer";
    data = [
      {
        id: "section 1",
        displayName: "Untitled Section",
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
                    properties: {},
                  },
                  {
                    id: "Number 1",
                    displayName: "Number 1",
                    type: "Number",
                    properties: {},
                  },
                  {
                    id: "Currency 1",
                    displayName: "Currency 1",
                    type: "Currency",
                    properties: {},
                  },
                  {
                    id: "Unit 1",
                    displayName: "Unit 1",
                    type: "Unit",
                    properties: { unit: "meters" },
                  },
                ],
              },
              {
                id: "Page 2",
                displayName: "Page 2",
                answers: [
                  {
                    id: "Percentage 2",
                    displayName: "Percentage 2",
                    type: "Percentage",
                    properties: {},
                  },
                  {
                    id: "Currency 2",
                    displayName: "Currency 2",
                    type: "Currency",
                    properties: {},
                  },
                  {
                    id: "Number 2",
                    displayName: "Number 2",
                    type: "Number",
                    properties: {},
                  },
                  {
                    id: "Unit 2",
                    displayName: "Unit 2",
                    type: "Unit",
                    properties: { unit: "centimeters" },
                  },
                  {
                    id: "Unit 3",
                    displayName: "Unit 3",
                    type: "Unit",
                    properties: { unit: "centimeters" },
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    props = {
      data,
      onClose,
      onSubmit,
      startingSelectedAnswers,
      title,
      showTypes,
    };
  });

  const renderContentPicker = () =>
    render(<QuestionPicker {...props} isOpen />);

  it("should allow multiselect and send all answers on submit", () => {
    const { getByText } = renderContentPicker();

    const percentageOne = getByText("Percentage 1").closest("li");
    const percentageTwo = getByText("Percentage 2").closest("li");

    fireEvent.click(percentageOne);
    fireEvent.click(percentageTwo);

    expect(percentageOne).toHaveAttribute("aria-selected", "true");
    expect(percentageTwo).toHaveAttribute("aria-selected", "true");

    fireEvent.click(getByText("Select"));

    expect(onSubmit).toHaveBeenCalledWith([
      {
        displayName: "Percentage 1",
        id: "Percentage 1",
        type: "Percentage",
        properties: {},
      },
      {
        displayName: "Percentage 2",
        id: "Percentage 2",
        type: "Percentage",
        properties: {},
      },
    ]);
  });

  it("should disable incompatible answer types", () => {
    const { getByText } = renderContentPicker();

    const percentageOne = getByText("Percentage 1").closest("li");
    const numberOne = getByText("Number 1").closest("li");

    fireEvent.click(percentageOne);

    expect(percentageOne).toHaveAttribute("aria-selected", "true");
    expect(numberOne).toHaveAttribute("disabled");
  });

  it("should allow compatible unit types", () => {
    const { getByText } = renderContentPicker();

    const unitTwo = getByText("Unit 2").closest("li");
    const unitThree = getByText("Unit 3").closest("li");

    fireEvent.click(unitTwo);
    fireEvent.click(unitThree);

    expect(unitTwo).toHaveAttribute("aria-selected", "true");
    expect(unitThree).toHaveAttribute("aria-selected", "true");
  });

  it("should disable incompatible unit types", () => {
    const { getByText } = renderContentPicker();

    const unitOne = getByText("Unit 1").closest("li");
    const unitTwo = getByText("Unit 2").closest("li");

    fireEvent.click(unitOne);

    expect(unitOne).toHaveAttribute("aria-selected", "true");
    expect(unitTwo).toHaveAttribute("disabled");
  });

  it("should deselect and reselect on successive clicks", () => {
    const { getByText } = renderContentPicker();

    const percentageOne = getByText("Percentage 1").closest("li");

    fireEvent.click(percentageOne);
    expect(percentageOne).toHaveAttribute("aria-selected", "true");

    fireEvent.click(percentageOne);
    expect(percentageOne).toHaveAttribute("aria-selected", "false");

    fireEvent.click(percentageOne);
    expect(percentageOne).toHaveAttribute("aria-selected", "true");
  });

  it("should start with the correct elements selected", () => {
    props.startingSelectedAnswers = [
      {
        id: "Percentage 1",
        displayName: "Percentage 1",
        type: "Percentage",
      },
    ];

    const { getByText } = renderContentPicker();

    const percentageOne = getByText("Percentage 1").closest("li");

    expect(percentageOne).toHaveAttribute("aria-selected", "true");
  });

  it("should be keyboard accessible", () => {
    const { getByText } = renderContentPicker();

    const percentageOne = getByText("Percentage 1").closest("li");

    fireEvent.keyUp(percentageOne, { key: "Enter", keyCode: 13 });
    expect(percentageOne).toHaveAttribute("aria-selected", "true");

    fireEvent.keyUp(percentageOne, { key: "Enter", keyCode: 13 });
    expect(percentageOne).toHaveAttribute("aria-selected", "false");

    fireEvent.keyUp(percentageOne, { key: "Enter", keyCode: 13 });
    expect(percentageOne).toHaveAttribute("aria-selected", "true");
  });

  it("should allow optional answer types via props", () => {
    props = {
      ...props,
      showTypes: true,
    };
    const { getByText } = renderContentPicker();

    expect(getByText("Allowed answer types:")).toBeTruthy();
  });
});
