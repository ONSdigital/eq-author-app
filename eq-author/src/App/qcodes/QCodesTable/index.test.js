import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";
import { QCodeContext } from "components/QCodeContext";
import { UnwrappedQCodeTable } from "./index";
import { buildAnswers } from "tests/utils/createMockQuestionnaire";

import { QCODE_IS_NOT_UNIQUE } from "constants/validationMessages";

import {
  // CHECKBOX,
  // RADIO,
  // TEXTFIELD,
  // TEXTAREA,
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  // DATE,
  // DATE_RANGE,
  UNIT,
  DURATION,
} from "constants/answer-types";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));

const dummyQcodes = {
  duplicate: "123",
  option: "9",
  confirmation: "10",
  calculatedSummary: "16",
  mutuallyExclusive: "20",
  dateRange: "99",
};

describe("Qcode Table", () => {
  let flattenedAnswers, duplicates;

  beforeEach(() => {
    /* 
    TODO tomorrow
    need:
      all number types = 5 
      text, textfield
      date, daterange
      checkbox
      radio
      11 answer types in total
      assert they exist
      assert shortcodes exist
      assert titles
      assert nested
      assert options are present
      assert mutually exclusive option is present
      assert radio only has one option
      assert date ranges have both options
      no confirmation
      no calculated summary
    */
    const nestedNumbers = buildAnswers({ answerCount: 5 });
    const numberMatrix = {
      0: NUMBER,
      1: CURRENCY,
      2: UNIT,
      3: PERCENTAGE,
      4: DURATION,
    };
    const flat = nestedNumbers.map((item, index) => {
      if (index > 0) {
        item.nested = true;
      }
      item.title = "<p>Questions 1</p>";
      item.type = numberMatrix[index];
      item.id = `ans-p1-${index}`;
      item.label = `${numberMatrix[index]}-${index}`;
      item.qCode = "123";
      return item;
    });
    flattenedAnswers = [
      ...flat,
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p7-1",
        description: "",
        guidance: "",
        label: "",
        qCode: "5",
        type: "Checkbox",
        questionPageId: "29ceee38-5ba4-4f43-84ae-0162c5b175f8",
        options: [[Object], [Object]],
        mutuallyExclusiveOption: {
          id: "cb-3",
          label: "Embedded checkbox Or",
          mutuallyExclusive: true,
          description: null,
          additionalAnswer: null,
          qCode: "29",
        },
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "cb-1",
        label: "Embedded checkbox Either",
        description: null,
        additionalAnswer: null,
        qCode: "27",
        type: "CheckboxOption",
        option: true,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "cb-2",
        label: "Either 2",
        description: null,
        additionalAnswer: null,
        qCode: "28",
        type: "CheckboxOption",
        option: true,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "cb-3",
        label: "Embedded checkbox Or",
        mutuallyExclusive: true,
        description: null,
        additionalAnswer: null,
        qCode: "29",
        type: "MutuallyExclusiveOption",
        option: true,
      },
      {
        title: "<p>Questions 2</p>",
        alias: undefined,
        id: "ans-p2-1",
        description: "",
        guidance: "",
        label: "Da1",
        qCode: "",
        secondaryQCode: "6",
        type: "Date",
        questionPageId: "qp-2",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 3</p>",
        alias: undefined,
        id: "ans-p3-1",
        description: "",
        guidance: "",
        label: "To",
        secondaryLabel: "From",
        qCode: "6",
        secondaryQCode: "99",
        type: "DateRange",
        questionPageId: "qp-3",
      },
      {
        title: "<p>Questions 3</p>",
        alias: undefined,
        nested: true,
        id: "ans-p3-1",
        label: "From",
        qCode: "99",
        type: "DateRange",
        validationErrorInfo: undefined,
        secondary: true,
      },
      {
        title: "<p>Questions 4</p>",
        alias: undefined,
        id: "ans-p4-1",
        description: "",
        guidance: "",
        label: "TF",
        qCode: "",
        secondaryQCode: "7",
        type: "TextField",
        questionPageId: "qp-4",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 4</p>",
        alias: undefined,
        nested: true,
        id: "ans-p4-2",
        description: "",
        guidance: "",
        label: "TA",
        qCode: "",
        secondaryQCode: "8",
        type: "TextArea",
        questionPageId: "qp-4",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 7</p>",
        alias: null,
        id: "ans-p6-1",
        description: "",
        guidance: "",
        label: "",
        qCode: "",
        type: "Radio",
        questionPageId: "qp-6",
        options: [[Object], [Object]],
      },
      {
        title: "<p>Questions 8</p>",
        alias: undefined,
        id: "ans-p7-1",
        description: "",
        guidance: "",
        label: "",
        qCode: "1238",
        type: "Checkbox",
        questionPageId: "29ceee38-5ba4-4f43-84ae-0162c5b175f8",
        options: [[Object], [Object]],
        mutuallyExclusiveOption: {
          id: "option-cb-2",
          label: "Or",
          mutuallyExclusive: true,
          description: null,
          additionalAnswer: null,
          qCode: "20",
        },
      },
      {
        title: "<p>Questions 8</p>",
        alias: undefined,
        nested: true,
        id: "option-cb-1",
        label: "Either",
        description: null,
        additionalAnswer: null,
        qCode: "9",
        type: "CheckboxOption",
        option: true,
      },
      {
        title: "<p>Questions 8</p>",
        alias: undefined,
        nested: true,
        id: "option-cb-3",
        label: "Either 2",
        description: null,
        additionalAnswer: null,
        qCode: "chk",
        type: "CheckboxOption",
        option: true,
      },
      {
        title: "<p>Questions 8</p>",
        alias: undefined,
        nested: true,
        id: "option-cb-2",
        label: "Or",
        mutuallyExclusive: true,
        description: null,
        additionalAnswer: null,
        qCode: "20",
        type: "MutuallyExclusiveOption",
        option: true,
      },
    ];

    duplicates = { 123: 2 };
  });

  const renderWithContext = () =>
    render(
      <QCodeContext.Provider value={{ flattenedAnswers, duplicates }}>
        <UnwrappedQCodeTable />
      </QCodeContext.Provider>
    );

  it("should render fields", () => {
    useMutation.mockImplementation(jest.fn(() => [jest.fn()]));
    const { getByText } = renderWithContext();
    const fieldHeadings = [
      "Short code",
      "Question",
      "Type",
      "Answer label",
      "Qcode",
    ];
    fieldHeadings.forEach((heading) => expect(getByText(heading)).toBeTruthy());
  });

  it("should render rows equivalent to the amount of Questions", () => {
    useMutation.mockImplementation(jest.fn(() => [jest.fn()]));
    const { getAllByText, getByText, getAllByTestId } = renderWithContext();
    const renderedQuestions = getAllByText((content) =>
      content.startsWith("Questions")
    );

    expect(getAllByText("Mutually exclusive checkbox").length).toEqual(2);
    expect(getByText("Embedded checkbox Either")).toBeTruthy();
    expect(getByText("Embedded checkbox Or")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(renderedQuestions.length).toEqual(6); // equal to non nested rows

    const answerRows = 19; // equal to answers present in flattenedAnswers
    expect(getAllByTestId("answer-row-test").length).toEqual(answerRows);
  });

  it("should make query to update Answer", () => {
    const updateAnswer = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateAnswer]));
    const { getByTestId } = renderWithContext();

    const testId = "ans-p1-1-test-input";
    const originalValue = dummyQcodes.duplicate;
    const input = getByTestId(testId);
    expect(input.value).toBe(originalValue);

    fireEvent.change(input, { target: { value: "187" } });

    fireEvent.blur(input);

    expect(updateAnswer).toHaveBeenCalledWith({
      variables: {
        input: { id: "ans-p1-1", properties: undefined, qCode: "187" },
      },
    });
    expect(input.value).toBe("187");
  });

  it("should make query to update Answer with a secondary option", () => {
    const updateAnswer = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateAnswer]));
    const { getAllByTestId } = renderWithContext();

    const testId = "ans-p3-1-test-input";
    const originalValue = dummyQcodes.dateRange;
    const input = getAllByTestId(testId)[1];
    expect(input.value).toBe(originalValue);

    fireEvent.change(input, { target: { value: "187" } });

    expect(input.value).toBe("187");

    fireEvent.blur(input);

    expect(updateAnswer).toHaveBeenCalledWith({
      variables: {
        input: { id: "ans-p3-1", properties: undefined, secondaryQCode: "187" },
      },
    });
  });

  it("should make query to update Option", () => {
    const updateOption = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [updateOption]));
    const { getByTestId } = renderWithContext();

    const testId = "option-cb-1-test-input";
    const originalValue = dummyQcodes.option;

    const input = getByTestId(testId);

    expect(input.value).toBe(originalValue);

    fireEvent.change(input, { target: { value: "187" } });

    expect(input.value).toBe("187");

    fireEvent.blur(input);
    expect(updateOption).toHaveBeenCalledWith({
      variables: {
        input: { id: "option-cb-1", properties: undefined, qCode: "187" },
      },
    });
  });

  it("should make query to update mutually exclusive Option", () => {
    const updateMutuallyExclusiveOption = jest.fn();
    useMutation.mockImplementation(
      jest.fn(() => [updateMutuallyExclusiveOption])
    );
    const { getByTestId } = renderWithContext();

    const testId = "option-cb-2-test-input";
    const originalValue = dummyQcodes.mutuallyExclusive;

    const input = getByTestId(testId);

    expect(input.value).toBe(originalValue);

    fireEvent.change(input, { target: { value: "187" } });

    expect(input.value).toBe("187");

    fireEvent.blur(input);

    expect(updateMutuallyExclusiveOption).toHaveBeenCalledWith({
      variables: {
        input: { id: "option-cb-2", properties: undefined, qCode: "187" },
      },
    });
  });

  it("should render a validation error when duplicate qCodes are present", () => {
    const { getAllByText } = renderWithContext();
    expect(getAllByText(QCODE_IS_NOT_UNIQUE).length).toBe(5);
  });

  it("should render a validation error when a qCode is missing", () => {
    const { getAllByText } = renderWithContext();
    expect(getAllByText("Qcode required")).toBeTruthy();
  });
});
