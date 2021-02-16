import React from "react";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";

import UPDATE_ANSWER_QCODE from "./graphql/updateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./graphql/updateOptionMutation.graphql";
import UPDATE_CONFIRMATION_QCODE from "./graphql/updateConfirmationQCode.graphql";

import { MeContext } from "App/MeContext";
import { QCodeContext } from "components/QCodeContext";
import { UnwrappedQCodeTable } from "./index";

import { QCODE_IS_NOT_UNIQUE } from "constants/validationMessages";

const dummyQcodes = {
  duplicate: "123",
  option: "9",
  confirmation: "10",
  calculatedSummary: "16",
  mutuallyExclusive: "20",
  dateRange: "99",
};

describe("Qcode Table", () => {
  let user,
    mocks,
    queryWasCalled,
    props,
    questionnaireId,
    flattenedAnswers,
    duplicates;

  beforeEach(() => {
    questionnaireId = "35b17858-cfac-4c66-80da-434ed2f995c3";

    flattenedAnswers = [
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        id: "ans-p1-1",
        description: "",
        guidance: "",
        label: "num1",
        qCode: "123",
        secondaryQCode: "1",
        type: "Number",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-2",
        description: "",
        guidance: "",
        label: "curr1",
        qCode: "123",
        secondaryQCode: "2",
        type: "Currency",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-3",
        description: "",
        guidance: "",
        label: "Un1",
        qCode: "1",
        secondaryQCode: "3",
        type: "Unit",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-4",
        description: "",
        guidance: "",
        label: "Per1",
        qCode: "2",
        secondaryQCode: "4",
        type: "Percentage",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-5",
        description: "",
        guidance: "",
        label: "Dur1",
        qCode: "3",
        secondaryQCode: "5",
        type: "Duration",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-6",
        description: "",
        guidance: "",
        label: "Num2",
        qCode: "4",
        secondaryQCode: "5",
        type: "Number",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
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
        title: "<p>Questions 5</p>",
        alias: undefined,
        id: "conf-q-1",
        qCode: "10",
        type: "QuestionConfirmation",
        validationErrorInfo: undefined,
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

    props = {
      loading: false,
    };
    user = {
      id: "1989",
      displayName: "Sir Reginald Hargreeves",
      email: "reggieH@umb.rell.a.ac.uk",
      picture:
        "https://i.pinimg.com/originals/ce/1b/3f/ce1b3f549c222d301991846ccdc25696.jpg",
      admin: true,
    };
    queryWasCalled = false;
    mocks = [
      {
        request: {
          query: UPDATE_ANSWER_QCODE,
          variables: {
            input: {
              id: "ans-p1-1",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateAnswer: {
                id: "ans-p1-1",
                qCode: "187",
                secondaryQCode: "",
                __typename: "BasicAnswer",
                validationErrorInfo: {
                  errors: [],
                  id: "errID110",
                  totalCount: 0,
                  __typename: "ValidationErrorInfo",
                },
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_ANSWER_QCODE,
          variables: {
            input: {
              id: "ans-p3-1",
              secondaryQCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateAnswer: {
                id: "ans-p3-1",
                qCode: "",
                secondaryQCode: "187",
                __typename: "BasicAnswer",
                validationErrorInfo: {
                  errors: [],
                  id: "errID111",
                  totalCount: 0,
                  __typename: "ValidationErrorInfo",
                },
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_OPTION_QCODE,
          variables: {
            input: {
              id: "option-cb-1",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateOption: {
                id: "option-cb-1",
                qCode: "187",
                __typename: "BasicAnswer",
                validationErrorInfo: {
                  errors: [],
                  id: "errID112",
                  totalCount: 0,
                  __typename: "ValidationErrorInfo",
                },
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_OPTION_QCODE,
          variables: {
            input: {
              id: "option-cb-2",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateOption: {
                id: "option-cb-2",
                qCode: "187",
                __typename: "BasicAnswer",
                validationErrorInfo: {
                  errors: [],
                  id: "errID113",
                  totalCount: 0,
                  __typename: "ValidationErrorInfo",
                },
              },
            },
          };
        },
      },
      {
        request: {
          query: UPDATE_CONFIRMATION_QCODE,
          variables: {
            input: {
              id: "conf-q-1",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateQuestionConfirmation: {
                id: "conf-q-1",
                qCode: "187",
                __typename: "BasicAnswer",
                validationErrorInfo: {
                  errors: [],
                  id: "errID114",
                  totalCount: 0,
                  __typename: "ValidationErrorInfo",
                },
              },
            },
          };
        },
      },
    ];
  });

  const renderWithContext = (Component, rest) =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <QCodeContext.Provider value={{ flattenedAnswers, duplicates }}>
          {Component}
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/qcode`,
        urlParamMatcher: "/q/:questionnaireId/qcode",
        mocks,
        ...rest,
      }
    );

  it("Should render fields", async () => {
    const { getByText } = renderWithContext(<UnwrappedQCodeTable {...props} />);
    const fieldHeadings = [
      "Short code",
      "Question",
      "Type",
      "Answer label",
      "Qcode",
    ];
    fieldHeadings.forEach((heading) => expect(getByText(heading)).toBeTruthy());
  });

  it("Should render rows equivalent to the amount of Questions", () => {
    const { getAllByText, getByText, getAllByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const renderedQuestions = getAllByText((content) =>
      content.startsWith("Questions")
    );

    const confirmationQuestion = getByText("Questions 5");
    expect(confirmationQuestion).toBeTruthy();
    expect(getAllByText("Mutually exclusive checkbox").length).toEqual(2);
    expect(getByText("Embedded checkbox Either")).toBeTruthy();
    expect(getByText("Embedded checkbox Or")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(renderedQuestions.length).toEqual(7); // equal to non nested rows

    const answerRows = 21; // equal to answers present in flattenedAnswers
    expect(getAllByTestId("answer-row-test").length).toEqual(answerRows);
  });

  it("Should make query to update Answer", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "ans-p1-1-test-input";
    const originalValue = dummyQcodes.duplicate;
    const input = getByTestId(testId);
    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update Answer with a secondary option", async () => {
    const { getAllByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "ans-p3-1-test-input";
    const originalValue = dummyQcodes.dateRange;
    const input = getAllByTestId(testId)[1];
    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update Option", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "option-cb-1-test-input";
    const originalValue = dummyQcodes.option;

    const input = getByTestId(testId);

    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update mutually exclusive Option", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "option-cb-2-test-input";
    const originalValue = dummyQcodes.mutuallyExclusive;

    const input = getByTestId(testId);

    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should make query to update confirmation", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "conf-q-1-test-input";
    const originalValue = dummyQcodes.confirmation;
    const input = getByTestId(testId);
    expect(input.value).toBe(originalValue);

    act(() => {
      fireEvent.change(input, { target: { value: "187" } });
    });

    expect(input.value).toBe("187");

    expect(queryWasCalled).toBeFalsy();

    await act(async () => {
      await fireEvent.blur(input);
      await flushPromises();
    });

    expect(queryWasCalled).toBeTruthy();
  });

  it("Should render a validation error when duplicate qCodes are present", () => {
    const { getAllByText } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    expect(getAllByText(QCODE_IS_NOT_UNIQUE).length).toBe(2);
  });

  it("Should render a validation error when a qCode is missing", async () => {
    const { getAllByText } = await renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    await expect(getAllByText("Qcode required")).toBeTruthy();
  });
});
