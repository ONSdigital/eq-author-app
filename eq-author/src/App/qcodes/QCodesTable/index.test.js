import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";
import { QCodeContext } from "components/QCodeContext";
import { UnwrappedQCodeTable } from "./index";
import { buildAnswers } from "tests/utils/createMockQuestionnaire";

import { QCODE_IS_NOT_UNIQUE } from "constants/validationMessages";

import {
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  DURATION,
} from "constants/answer-types";

jest.mock("@apollo/react-hooks", () => ({
  useMutation: jest.fn(),
}));

useMutation.mockImplementation(jest.fn(() => [jest.fn()]));

const renderWithContext = ({
  flattenedAnswers,
  duplicates = { 123: 5 },
} = {}) => {
  const utils = render(
    <QCodeContext.Provider value={{ flattenedAnswers, duplicates }}>
      <UnwrappedQCodeTable />
    </QCodeContext.Provider>
  );
  return { ...utils };
};

const numberMatrix = {
  0: NUMBER,
  1: CURRENCY,
  2: UNIT,
  3: PERCENTAGE,
  4: DURATION,
};

const numberAnswers = ({ title = "Questions", nested = true } = {}) =>
  buildAnswers({ answerCount: 5 }).map((item, index) => {
    if (index > 0 && nested) {
      item.nested = true;
    }
    const type = numberMatrix[index].toLowerCase();
    item.id = `${type}-${index}-id`;
    item.alias = `${type}-${index}-alias`;
    item.title = `<p>${title} ${index}</p>`;
    item.type = numberMatrix[index];
    item.label = `${type}-${index}-label`;
    item.qCode = `${123}`;
    item.properties = { required: false };
    return item;
  });

const dateAnswers = [
  {
    id: "date-id",
    title: "<p>Date questions</p>",
    alias: "date-alias",
    label: "date-label",
    type: "Date",
    qCode: "date-345",
  },
  {
    id: "date-range-1-id",
    title: "<p>Date range questions</p>",
    alias: "date-range-alias",
    label: "To",
    secondaryLabel: "From",
    qCode: "date-range-345-to",
    secondaryQCode: "99",
    type: "DateRange",
  },
  {
    id: "date-range-2-id",
    title: "<p>Date range questions</p>",
    alias: undefined,
    nested: true,
    label: "From",
    qCode: "date-range-345-from",
    type: "DateRange",
    secondary: true,
  },
];

const textAnswers = [
  {
    id: "text-field-id",
    alias: "text-field-alias",
    title: "<p>Questions text field</p>",
    label: "text-field-label",
    qCode: "text-f-123",
    type: "TextField",
  },
  {
    id: "text-area-id",
    alias: "text-area-alias",
    title: "<p>Questions text area</p>",
    label: "text-area-label",
    qCode: "text-a-123",
    type: "TextArea",
  },
];

const optionsAnswers = [
  {
    id: "radio-id",
    alias: "radio-alias",
    title: "<p>radio-title</p>",
    label: "radio-label",
    type: "Radio",
    qCode: "radio-123",
  },
  {
    id: "checkbox-id",
    alias: "checkbox-alias",
    title: "<p>Checkbox question</p>",
    label: "checkbox-label",
    type: "Checkbox",
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
    id: "checkbox-option-1-id",
    alias: "checkbox-option-1-alias",
    title: "<p>Checkbox option 1</p>",
    nested: true,
    label: "checkbox-option-1-label",
    qCode: "option-1",
    type: "CheckboxOption",
    option: true,
  },
  {
    id: "checkbox-option-2-id",
    alias: "checkbox-option-2-alias",
    title: "<p>Checkbox option 2</p>",
    nested: true,
    label: "checkbox-option-2-label",
    qCode: "option-2",
    type: "CheckboxOption",
    option: true,
  },
  {
    id: "checkbox-option-3-id",
    alias: "checkbox-option-mutually-exclusive",
    title: "<p>Mutually exclusive option</p>",
    nested: true,
    label: "Mutually-exclusive-option-label",
    mutuallyExclusive: true,
    qCode: "mutually-exclusive-option",
    type: "MutuallyExclusiveOption",
    option: true,
  },
];

const numberSetup = () => ({
  ...renderWithContext({ flattenedAnswers: numberAnswers() }),
});

const dateSetup = () => ({
  ...renderWithContext({ flattenedAnswers: dateAnswers }),
});

const textSetup = () => ({
  ...renderWithContext({ flattenedAnswers: textAnswers }),
});

const optionsSetup = () => ({
  ...renderWithContext({ flattenedAnswers: optionsAnswers }),
});

describe("Qcode Table", () => {
  it("should render table fields", () => {
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

  it("should render a validation error when duplicate qCodes are present", () => {
    const { getAllByText } = numberSetup();
    expect(getAllByText(QCODE_IS_NOT_UNIQUE).length).toBe(5);
  });

  it("should render a validation error when a qCode is missing", () => {
    const answers = numberAnswers();
    answers[0].qCode = "";
    const { getAllByText } = renderWithContext({
      flattenedAnswers: answers,
    });
    expect(getAllByText("Qcode required")).toBeTruthy();
  });

  it("should not save qCode if it is the same as the initial qCode", () => {
    const mock = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [mock]));
    const utils = numberSetup();
    fireEvent.change(utils.getByTestId("number-0-id-test-input"), {
      target: { value: "123" },
    });

    fireEvent.blur(utils.getByTestId("number-0-id-test-input"));
    expect(mock).not.toHaveBeenCalled();
  });

  describe("Answer types", () => {
    describe("Numerical", () => {
      let utils, mock;
      beforeEach(() => {
        mock = jest.fn();
        useMutation.mockImplementation(jest.fn(() => [mock]));
        utils = numberSetup();
      });
      describe("Number", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/number-0-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Questions 0/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getByText(/Number/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/number-0-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("number-0-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("number-0-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("number-0-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "number-0-id",
                properties: { required: false },
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Currency", () => {
        it("should display shortcode", () => {
          expect(utils.queryByText(/currency-1-alias/)).toBeNull();
        });
        it("should display question", () => {
          expect(utils.queryByText(/Questions 1/)).toBeNull();
        });
        it("should display type", () => {
          expect(utils.getByText(/Currency/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/currency-1-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("currency-1-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("currency-1-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("currency-1-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "currency-1-id",
                properties: { required: false },
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Unit", () => {
        it("should display shortcode", () => {
          expect(utils.queryByText(/unit-2-alias/)).toBeNull();
        });
        it("should display question", () => {
          expect(utils.queryByText(/Questions 2/)).toBeNull();
        });
        it("should display type", () => {
          expect(utils.getByText(/Unit/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/unit-2-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("unit-2-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("unit-2-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("unit-2-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "unit-2-id",
                properties: { required: false },
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Percentage", () => {
        it("should display shortcode", () => {
          expect(utils.queryByText(/percentage-3-alias/)).toBeNull();
        });
        it("should display question", () => {
          expect(utils.queryByText(/Questions 3/)).toBeNull();
        });
        it("should display type", () => {
          expect(utils.getByText(/Percentage/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/percentage-3-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("percentage-3-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("percentage-3-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("percentage-3-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "percentage-3-id",
                properties: { required: false },
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Duration", () => {
        it("should display shortcode", () => {
          expect(utils.queryByText(/duration-4-alias/)).toBeNull();
        });
        it("should display question", () => {
          expect(utils.queryByText(/Questions 4/)).toBeNull();
        });
        it("should display type", () => {
          expect(utils.getByText(/Duration/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/duration-4-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("duration-4-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("duration-4-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("duration-4-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "duration-4-id",
                properties: { required: false },
                qCode: "187",
              },
            },
          });
        });
      });
    });
    describe("Dates", () => {
      let utils, mock;
      beforeEach(() => {
        mock = jest.fn();
        useMutation.mockImplementation(jest.fn(() => [mock]));
        utils = dateSetup();
      });
      describe("Date", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/date-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Date questions/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getAllByText(/Date/)[0]).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/date-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("date-id-test-input").value).toEqual(
            "date-345"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("date-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("date-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "date-id", qCode: "187" } },
          });
        });
      });

      describe("Date range", () => {
        describe("To", () => {
          it("should display shortcode", () => {
            expect(utils.getByText(/date-range-alias/)).toBeVisible();
          });
          it("should display question", () => {
            expect(utils.getByText(/Date range questions/)).toBeVisible();
          });
          it("should display type", () => {
            expect(utils.getAllByText(/Date/)[1]).toBeVisible();
          });
          it("should display answer label", () => {
            expect(utils.getByText(/To/)).toBeVisible();
          });
          it("should display answer qCode", () => {
            expect(
              utils.getByTestId("date-range-1-id-test-input").value
            ).toEqual("date-range-345-to");
          });
          it("should save qCode", () => {
            fireEvent.change(utils.getByTestId("date-range-1-id-test-input"), {
              target: { value: "187" },
            });

            fireEvent.blur(utils.getByTestId("date-range-1-id-test-input"));
            expect(mock).toHaveBeenCalledWith({
              variables: { input: { id: "date-range-1-id", qCode: "187" } },
            });
          });
        });

        describe("From", () => {
          it("should display answer label", () => {
            expect(utils.getByText(/From/)).toBeVisible();
          });
          it("should display answer qCode", () => {
            expect(
              utils.getByTestId("date-range-2-id-test-input").value
            ).toEqual("date-range-345-from");
          });
          it("should save qCode", () => {
            fireEvent.change(utils.getByTestId("date-range-2-id-test-input"), {
              target: { value: "187" },
            });

            fireEvent.blur(utils.getByTestId("date-range-2-id-test-input"));
            expect(mock).toHaveBeenCalledWith({
              variables: {
                input: { id: "date-range-2-id", secondaryQCode: "187" },
              },
            });
          });
        });
      });
    });
    describe("Text", () => {
      let utils, mock;
      beforeEach(() => {
        mock = jest.fn();
        useMutation.mockImplementation(jest.fn(() => [mock]));
        utils = textSetup();
      });
      describe("TextField", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/text-field-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Questions text field/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getByText(/Text field/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/text-field-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("text-field-id-test-input").value).toEqual(
            "text-f-123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("text-field-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("text-field-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "text-field-id", qCode: "187" } },
          });
        });
      });

      describe("TextArea", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/text-area-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Questions text area/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getByText(/Text area/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/text-area-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("text-area-id-test-input").value).toEqual(
            "text-a-123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("text-area-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("text-area-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "text-area-id", qCode: "187" } },
          });
        });
      });
    });
    describe("Options", () => {
      let utils, mock;
      beforeEach(() => {
        mock = jest.fn();
        useMutation.mockImplementation(jest.fn(() => [mock]));
        utils = optionsSetup();
      });
      describe("Radio", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/radio-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/radio-title/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getByText(/Radio/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/radio-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("radio-id-test-input").value).toEqual(
            "radio-123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("radio-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("radio-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "radio-id", qCode: "187" } },
          });
        });
      });

      describe("Checkbox", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/checkbox-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Checkbox question/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/checkbox-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.queryByTestId("checkbox-id-test-input")).toBeNull();
        });

        describe("options", () => {
          it("should display shortcode", () => {
            expect(utils.queryByText(/checkbox-option-1-alias/)).toBeNull();
            expect(utils.queryByText(/checkbox-option-2-alias/)).toBeNull();
            expect(
              utils.queryByText(/checkbox-option-mutually-exclusive/)
            ).toBeNull();
          });
          it("should display question", () => {
            expect(utils.queryByText(/Checkbox option 1/)).toBeNull();
            expect(utils.queryByText(/Checkbox option 2/)).toBeNull();
            expect(utils.queryByText(/Mutually exclusive option/)).toBeNull();
          });
          it("should display type", () => {
            expect(utils.getAllByText(/Checkbox option/)).toHaveLength(2);
            expect(
              utils.getByText(/Mutually exclusive checkbox/)
            ).toBeVisible();
          });
          it("should display answer label", () => {
            expect(utils.getByText(/checkbox-option-1-label/)).toBeVisible();
            expect(utils.getByText(/checkbox-option-2-label/)).toBeVisible();
            expect(
              utils.getByText(/Mutually-exclusive-option-label/)
            ).toBeVisible();
          });
          it("should display answer qCode", () => {
            expect(
              utils.getByTestId("checkbox-option-1-id-test-input").value
            ).toEqual("option-1");
            expect(
              utils.getByTestId("checkbox-option-2-id-test-input").value
            ).toEqual("option-2");
            expect(
              utils.getByTestId("checkbox-option-3-id-test-input").value
            ).toEqual("mutually-exclusive-option");
          });
          it("should save qCode for option", () => {
            fireEvent.change(
              utils.getByTestId("checkbox-option-1-id-test-input"),
              {
                target: { value: "187" },
              }
            );

            fireEvent.blur(
              utils.getByTestId("checkbox-option-1-id-test-input")
            );
            expect(mock).toHaveBeenCalledWith({
              variables: {
                input: { id: "checkbox-option-1-id", qCode: "187" },
              },
            });
          });

          it("should save qCode for mutually exclusive option", () => {
            fireEvent.change(
              utils.getByTestId("checkbox-option-3-id-test-input"),
              {
                target: { value: "187" },
              }
            );

            fireEvent.blur(
              utils.getByTestId("checkbox-option-3-id-test-input")
            );
            expect(mock).toHaveBeenCalledWith({
              variables: {
                input: { id: "checkbox-option-3-id", qCode: "187" },
              },
            });
          });
        });
      });
    });
  });
});
