import React from "react";
import { render } from "tests/utils/rtl";

import AnswerProperties from "./";

describe("Answer Properties", () => {
  let data,
    data2,
    onClose,
    onSubmit,
    updateAnswerOfType,
    updateAnswer,
    startingSelectedAnswers,
    title,
    showTypes,
    answer,
    props;

  const validationErrorInfo = {
    errors: [],
    id: "eror-1",
    totalCount: "0",
    __typename: "ValidationErrorInfo",
  };

  beforeEach(() => {
    onClose = jest.fn();
    onSubmit = jest.fn();
    updateAnswerOfType = jest.fn();
    updateAnswer = jest.fn();
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
                    id: "Number 1",
                    displayName: "Number 1",
                    type: "Number",
                    properties: {
                      decimals: 0,
                    },
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "Unit 1",
                    displayName: "Unit 1",
                    type: "Unit",
                    properties: {
                      unit: "Centimetres",
                      decimals: 0,
                    },
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "Duration 1",
                    displayName: "Duration 1",
                    type: "Duration",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "TextField 1",
                    displayName: "TextField 1",
                    type: "TextField",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "TextArea 1",
                    displayName: "TextArea 1",
                    type: "TextArea",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "Date 1",
                    displayName: "Date 1",
                    type: "Date",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "DateRange 1",
                    displayName: "DateRange 1",
                    type: "DateRange",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "Radio 1",
                    displayName: "Radio 1",
                    type: "Radio",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "Checkbox 1",
                    displayName: "Checkbox 1",
                    type: "Checkbox",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "Select 1",
                    displayName: "Select 1",
                    type: "Select",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    data2 = [
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
                    id: "Checkbox 1",
                    displayName: "Checkbox 1",
                    type: "Checkbox",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
                  },
                  {
                    id: "MutuallyExclusive 1",
                    displayName: "MutuallyExclusive 1",
                    type: "MutuallyExclusive",
                    properties: {},
                    validationErrorInfo: validationErrorInfo,
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
      answer,
      showTypes,
      updateAnswerOfType,
      updateAnswer,
    };
  });

  const renderAnswerProperties = () =>
    render(<AnswerProperties {...props} isOpen />);

  it("should check that Number properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[0],
      value: 0,
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Number 1")).toBeInTheDocument();
  });

  it("should check that Unit properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[1],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Unit 1")).toBeInTheDocument();
  });

  it("should check that Duration properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[2],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Duration 1")).toBeInTheDocument();
  });

  it("should check that TextField properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[3],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("TextField 1")).toBeInTheDocument();
  });

  it("should check that TextArea properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[4],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("TextArea 1")).toBeInTheDocument();
  });

  it("should check that Date properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[5],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Date 1")).toBeInTheDocument();
  });

  it("should check that DateRange properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[6],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("DateRange 1")).toBeInTheDocument();
  });

  it("should check that Radio properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[7],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Radio 1")).toBeInTheDocument();
  });

  it("should check that Checkbox properties are called", () => {
    props = {
      ...props,
      answer: data2[0].folders[0].pages[0].answers[0],
      page: data2[0].folders[0].pages[0],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Checkbox 1")).toBeInTheDocument();
  });

  it("should check that Select properties are called", () => {
    props = {
      ...props,
      answer: data[0].folders[0].pages[0].answers[9],
    };
    const { getByTestId } = renderAnswerProperties();

    expect(getByTestId("Select 1")).toBeInTheDocument();
  });
});
