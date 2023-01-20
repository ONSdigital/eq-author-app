import React from "react";
import { render, fireEvent } from "tests/utils/rtl";
import { useMutation } from "@apollo/react-hooks";
import { QCodeContextProvider } from "components/QCodeContext";
import QuestionnaireContext from "components/QuestionnaireContext";
import { QCodeTable } from "./index";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

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

const renderWithContext = ({ questionnaire } = {}) =>
  render(
    <QCodeContextProvider questionnaire={questionnaire}>
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        <QCodeTable />
      </QuestionnaireContext.Provider>
    </QCodeContextProvider>
  );

const numberTypes = {
  0: NUMBER,
  1: CURRENCY,
  2: UNIT,
  3: PERCENTAGE,
  4: DURATION,
};

const numberSetup = () => {
  const questionnaire = buildQuestionnaire({ answerCount: 5 });
  Object.assign(questionnaire.sections[0].folders[0].pages[0], {
    title: "<p>Numerical question types</p>",
    alias: "numerical-types-alias",
  });
  questionnaire.sections[0].folders[0].pages[0].answers.forEach(
    (answer, index) => {
      answer.id = `${numberTypes[index]}-id`;
      answer.type = numberTypes[index];
      answer.qCode = "123";
      answer.label = numberTypes[index] + "-label";
    }
  );

  return renderWithContext({ questionnaire });
};

const dateSetup = () => {
  const questionnaire = buildQuestionnaire({ answerCount: 2 });
  Object.assign(questionnaire.sections[0].folders[0].pages[0], {
    title: "<p>Date question types</p>",
    alias: "date-types-alias",
  });
  Object.assign(
    questionnaire.sections[0].folders[0].pages[0].answers[0],
    generateAnswer({ type: "Date" })
  );
  Object.assign(
    questionnaire.sections[0].folders[0].pages[0].answers[1],
    generateAnswer({
      type: "DateRange",
      secondaryLabel: "To",
      label: "From",
      secondaryQCode: "DateRange-To-qCode",
    })
  );
  return renderWithContext({ questionnaire });
};

const generateAnswer = (input) => ({
  id: input.type + "-id",
  qCode: input.type + "-qCode",
  label: input.type + "-label",
  ...input,
});

const textSetup = () => {
  const questionnaire = buildQuestionnaire({ answerCount: 2 });
  Object.assign(questionnaire.sections[0].folders[0].pages[0], {
    title: "<p>Text question types</p>",
    alias: "text-types-alias",
  });
  Object.assign(
    questionnaire.sections[0].folders[0].pages[0].answers[0],
    generateAnswer({ type: "TextArea" })
  );
  Object.assign(
    questionnaire.sections[0].folders[0].pages[0].answers[1],
    generateAnswer({ type: "TextField" })
  );

  return renderWithContext({ questionnaire });
};

const optionsSetup = (dataVersion) => {
  const questionnaire = buildQuestionnaire({ answerCount: 2 });
  Object.assign(questionnaire.sections[0].folders[0].pages[0], {
    alias: "multiple-choice-answer-types-alias",
    title: "<p>Multiple choice answer types</p>",
  });

  // Radio answer with one option
  Object.assign(
    questionnaire.sections[0].folders[0].pages[0].answers[0],
    generateAnswer({
      type: "Radio",
      options: [
        {
          id: "radio-option-1",
          label: "radio-option-1-label",
          type: "Option",
        },
      ],
    })
  );

  // Checkbox answer with two options & mutually exclusive option
  Object.assign(
    questionnaire.sections[0].folders[0].pages[0].answers[1],
    (questionnaire.dataVersion = dataVersion),
    generateAnswer({
      type: "Checkbox",
      id: "checkbox-answer-id",
      options: [
        {
          id: "checkbox-option-1-id",
          label: "checkbox-option-1-label",
          qCode: "option-1",
        },
        {
          id: "checkbox-option-2-id",
          label: "checkbox-option-2-label",
          qCode: "option-2",
        },
      ],
      mutuallyExclusiveOption: {
        id: "checkbox-option-3-id",
        label: "Mutually-exclusive-option-label",
        mutuallyExclusive: true,
        qCode: "mutually-exclusive-option",
      },
    })
  );

  return renderWithContext({ questionnaire });
};

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
    const questionnaire = buildQuestionnaire({ answerCount: 1 });
    questionnaire.sections[0].folders[0].pages[0].answers[0].qCode = "";
    const { getAllByText } = renderWithContext({ questionnaire });
    expect(getAllByText("Qcode required")).toBeTruthy();
  });

  it("should not save qCode if it is the same as the initial qCode", () => {
    const mock = jest.fn();
    useMutation.mockImplementation(jest.fn(() => [mock]));
    const utils = numberSetup();
    fireEvent.change(utils.getByTestId("Number-id-test-input"), {
      target: { value: "123" },
    });

    fireEvent.blur(utils.getByTestId("Number-id-test-input"));
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
      describe("Question page", () => {
        it("should display shortcode", () => {
          expect(utils.getByText(/numerical-types-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Numerical question types/)).toBeVisible();
        });
      });
      describe("Number", () => {
        it("should display type", () => {
          expect(utils.getByText(/^Number$/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Number-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Number-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Number-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Number-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "Number-id",
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Currency", () => {
        it("should display type", () => {
          expect(utils.getByText(/^Currency$/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Currency-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Currency-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Currency-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Currency-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "Currency-id",
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Unit", () => {
        it("should display type", () => {
          expect(utils.getByText(/^Unit$/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Unit-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Unit-id-test-input").value).toEqual("123");
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Unit-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Unit-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "Unit-id",
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Percentage", () => {
        it("should display type", () => {
          expect(utils.getByText(/^Percentage$/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Percentage-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Percentage-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Percentage-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Percentage-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "Percentage-id",
                qCode: "187",
              },
            },
          });
        });
      });
      describe("Duration", () => {
        it("should display type", () => {
          expect(utils.getByText(/^Duration$/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Duration-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Duration-id-test-input").value).toEqual(
            "123"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Duration-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Duration-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: {
              input: {
                id: "Duration-id",
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
          expect(utils.getByText(/date-types-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Date question types/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getAllByText(/Date/)[0]).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Date-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Date-id-test-input").value).toEqual(
            "Date-qCode"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Date-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Date-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "Date-id", qCode: "187" } },
          });
        });
      });

      describe("Date range", () => {
        describe("To", () => {
          it("should display type", () => {
            expect(utils.getAllByText(/Date/)[1]).toBeVisible();
          });
          it("should display answer label", () => {
            expect(utils.getByText(/To/)).toBeVisible();
          });
          it("should display answer qCode", () => {
            expect(
              utils.getByTestId("DateRange-id-secondary-test-input").value
            ).toEqual("DateRange-To-qCode");
          });
          it("should save qCode", () => {
            fireEvent.change(
              utils.getByTestId("DateRange-id-secondary-test-input"),
              {
                target: { value: "187" },
              }
            );

            fireEvent.blur(
              utils.getByTestId("DateRange-id-secondary-test-input")
            );
            expect(mock).toHaveBeenCalledWith({
              variables: {
                input: { id: "DateRange-id", secondaryQCode: "187" },
              },
            });
          });
        });

        describe("From", () => {
          it("should display answer label", () => {
            expect(utils.getByText(/From/)).toBeVisible();
          });
          it("should display answer qCode", () => {
            expect(utils.getByTestId("DateRange-id-test-input").value).toEqual(
              "DateRange-qCode"
            );
          });
          it("should save qCode", () => {
            fireEvent.change(utils.getByTestId("DateRange-id-test-input"), {
              target: { value: "187" },
            });

            fireEvent.blur(utils.getByTestId("DateRange-id-test-input"));
            expect(mock).toHaveBeenCalledWith({
              variables: {
                input: { id: "DateRange-id", qCode: "187" },
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
          expect(utils.getByText(/text-types-alias/)).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Text question types/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getByText(/Text field/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/TextField-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("TextField-id-test-input").value).toEqual(
            "TextField-qCode"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("TextField-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("TextField-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "TextField-id", qCode: "187" } },
          });
        });
      });

      describe("TextArea", () => {
        it("should display type", () => {
          expect(utils.getByText(/Text area/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/TextArea-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("TextArea-id-test-input").value).toEqual(
            "TextArea-qCode"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("TextArea-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("TextArea-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "TextArea-id", qCode: "187" } },
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
          expect(
            utils.getByText(/multiple-choice-answer-types-alias/)
          ).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Multiple choice answer types/)).toBeVisible();
        });
        it("should display type", () => {
          expect(utils.getByText("Radio")).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Radio-label/)).toBeVisible();
        });
        it("should display answer qCode", () => {
          expect(utils.getByTestId("Radio-id-test-input").value).toEqual(
            "Radio-qCode"
          );
        });
        it("should save qCode", () => {
          fireEvent.change(utils.getByTestId("Radio-id-test-input"), {
            target: { value: "187" },
          });

          fireEvent.blur(utils.getByTestId("Radio-id-test-input"));
          expect(mock).toHaveBeenCalledWith({
            variables: { input: { id: "Radio-id", qCode: "187" } },
          });
        });

        describe("Options", () => {
          it("should display type", () => {
            expect(utils.getAllByText(/Radio option/)).toHaveLength(1);
          });
          it("should display radio option label", () => {
            expect(utils.getByText(/radio-option-1-label/)).toBeVisible();
          });
          it("should NOT display option qCode", () => {
            expect(
              utils.queryByTestId("radio-option-1-id-test-input")
            ).toBeNull();
          });
        });
      });

      describe("Checkbox", () => {
        it("should display shortcode", () => {
          expect(
            utils.getByText(/multiple-choice-answer-types-alias/)
          ).toBeVisible();
        });
        it("should display question", () => {
          expect(utils.getByText(/Multiple choice answer types/)).toBeVisible();
        });
        it("should display answer label", () => {
          expect(utils.getByText(/Checkbox-label/)).toBeVisible();
        });
        it("should NOT display answer qCode", () => {
          expect(utils.queryByTestId("Checkbox-id-test-input")).toBeNull();
        });

        describe("options", () => {
          it("should display type", () => {
            expect(utils.getAllByText(/Checkbox option/)).toHaveLength(2);
            expect(utils.getByText(/Mutually exclusive/)).toBeVisible();
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

    describe("Data version 3", () => {
      let utils, mock;

      beforeEach(() => {
        mock = jest.fn();
        useMutation.mockImplementation(jest.fn(() => [mock]));
        utils = optionsSetup("3");
      });

      it("should display answer qCodes without option qCodes for checkbox answers in data version 3", () => {
        expect(
          utils.queryByTestId("checkbox-option-1-id-test-input")
        ).not.toBeInTheDocument();

        expect(
          utils.queryByTestId("checkbox-option-2-id-test-input")
        ).not.toBeInTheDocument();

        expect(
          utils.getByTestId("checkbox-answer-id-test-input")
        ).toBeInTheDocument();

        expect(
          utils.getByTestId("checkbox-option-3-id-test-input").value
        ).toEqual("mutually-exclusive-option");
      });

      it("should save qCode for checkbox answer", () => {
        fireEvent.change(utils.getByTestId("checkbox-answer-id-test-input"), {
          target: { value: "123" },
        });

        fireEvent.blur(utils.getByTestId("checkbox-answer-id-test-input"));

        expect(mock).toHaveBeenCalledWith({
          variables: {
            input: { id: "checkbox-answer-id", qCode: "123" },
          },
        });
      });

      it("should render a validation error when a qCode is missing in data version 3", () => {
        const questionnaire = buildQuestionnaire({ answerCount: 1 });
        questionnaire.sections[0].folders[0].pages[0].answers[0].qCode = "";
        questionnaire.dataVersion = "3";
        const { getAllByText } = renderWithContext({ questionnaire });
        expect(getAllByText("Qcode required")).toBeTruthy();
      });

      it("should render a validation error when duplicate qCodes are present in data version 3", () => {
        const questionnaire = buildQuestionnaire({ answerCount: 2 });
        questionnaire.sections[0].folders[0].pages[0].answers[0].qCode = "1";
        questionnaire.sections[0].folders[0].pages[0].answers[1].qCode = "1";
        questionnaire.dataVersion = "3";
        const { getAllByText } = renderWithContext({ questionnaire });
        expect(getAllByText(QCODE_IS_NOT_UNIQUE)).toBeTruthy();
      });

      it("should map qCode rows when additional answer is set to true in data version 3", () => {
        const questionnaire = buildQuestionnaire({ answerCount: 2 });
        questionnaire.sections[0].folders[0].pages[0].answers[0].qCode = "1";
        questionnaire.dataVersion = "3";
        const option = {
          id: "1",
          label: "",
          description: "",
          additionalAnswer: {
            id: "additional1",
            label: "",
            type: "TextField",
            validationErrorInfo: {
              errors: [],
              totalCount: 0,
            },
          },
        };
        questionnaire.sections[0].folders[0].pages[0].answers[0].options[0] =
          option;
        const { getAllByText } = renderWithContext({ questionnaire });
        expect(getAllByText("Qcode required")).toBeTruthy();
      });
    });
  });
});
