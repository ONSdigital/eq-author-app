import React from "react";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";

import UPDATE_ANSWER_QCODE from "./graphql/updateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./graphql/updateOptionMutation.graphql";
import UPDATE_CONFIRMATION_QCODE from "./graphql/updateConfirmationQCode.graphql";

import { MeContext } from "App/MeContext";
import { UnwrappedQCodeTable } from "./index";
import QuestionnaireContext from "components/QuestionnaireContext";

import {
  UNIT,
  DURATION,
  PERCENTAGE,
  CURRENCY,
  TEXTFIELD,
  TEXTAREA,
  RADIO,
  DATE_RANGE,
  DATE,
  CHECKBOX,
  NUMBER,
} from "constants/answer-types";
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
  let user, questionnaire, mocks, queryWasCalled, props, questionnaireId;

  beforeEach(() => {
    questionnaireId = "35b17858-cfac-4c66-80da-434ed2f995c3";

    questionnaire = {
      sections: [
        {
          folders: [
            {
              pages: [
                {
                  id: "page-1",
                  pageType: "QuestionPage",
                  title: "<p>Questions 1</p>",
                  description: "",
                  answers: [
                    {
                      id: "ans-p1-1",
                      description: "",
                      guidance: "",
                      label: "num1",
                      qCode: dummyQcodes.duplicate,
                      secondaryQCode: "1",
                      type: NUMBER,
                      questionPageId: "qp-1",
                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p1-2",
                      description: "",
                      guidance: "",
                      label: "curr1",
                      qCode: dummyQcodes.duplicate,
                      secondaryQCode: "2",
                      type: CURRENCY,
                      questionPageId: "qp-1",

                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p1-3",
                      description: "",
                      guidance: "",
                      label: "Un1",
                      qCode: "1",
                      secondaryQCode: "3",
                      type: UNIT,
                      questionPageId: "qp-1",

                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p1-4",
                      description: "",
                      guidance: "",
                      label: "Per1",
                      qCode: "2",
                      secondaryQCode: "4",
                      type: PERCENTAGE,
                      questionPageId: "qp-1",

                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p1-5",
                      description: "",
                      guidance: "",
                      label: "Dur1",
                      qCode: "3",
                      secondaryQCode: "5",
                      type: DURATION,
                      questionPageId: "qp-1",

                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p1-6",
                      description: "",
                      guidance: "",
                      label: "Num2",
                      qCode: "4",
                      secondaryQCode: "5",
                      type: NUMBER,
                      questionPageId: "qp-1",

                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p7-1",
                      description: "",
                      guidance: "",
                      label: "",
                      qCode: "5",
                      type: CHECKBOX,
                      questionPageId: "29ceee38-5ba4-4f43-84ae-0162c5b175f8",
                      options: [
                        {
                          id: "cb-1",
                          label: "Embedded checkbox Either",
                          description: null,
                          additionalAnswer: null,
                          qCode: "27",
                        },
                        {
                          id: "cb-2",
                          label: "Either 2",
                          description: null,
                          additionalAnswer: null,
                          qCode: "28",
                        },
                      ],
                      mutuallyExclusiveOption: {
                        id: "cb-3",
                        label: "Embedded checkbox Or",
                        mutuallyExclusive: true,
                        description: null,
                        additionalAnswer: null,
                        qCode: "29",
                      },
                    },
                  ],
                },
                {
                  id: "page-2",
                  pageType: "QuestionPage",
                  title: "<p>Questions 2</p>",
                  description: "",
                  answers: [
                    {
                      id: "ans-p2-1",
                      description: "",
                      guidance: "",
                      label: "Da1",
                      qCode: "",
                      secondaryQCode: "6",
                      type: DATE,
                      questionPageId: "qp-2",

                      secondaryLabel: null,
                    },
                  ],
                },
                {
                  id: "page-3",
                  pageType: "QuestionPage",
                  title: "<p>Questions 3</p>",
                  description: "",
                  answers: [
                    {
                      id: "ans-p3-1",
                      description: "",
                      guidance: "",
                      label: "To",
                      secondaryLabel: "From",
                      qCode: "6",
                      secondaryQCode: dummyQcodes.dateRange,
                      type: DATE_RANGE,
                      questionPageId: "qp-3",
                    },
                  ],
                },
                {
                  id: "page-4",
                  pageType: "QuestionPage",
                  title: "<p>Questions 4</p>",
                  description: "",
                  answers: [
                    {
                      id: "ans-p4-1",
                      description: "",
                      guidance: "",
                      label: "TF",
                      qCode: "",
                      secondaryQCode: "7",
                      type: TEXTFIELD,
                      questionPageId: "qp-4",
                      secondaryLabel: null,
                    },
                    {
                      id: "ans-p4-2",
                      description: "",
                      guidance: "",
                      label: "TA",
                      qCode: "",
                      secondaryQCode: "8",
                      type: TEXTAREA,
                      questionPageId: "qp-4",
                      secondaryLabel: null,
                    },
                  ],
                  sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
                  confirmation: {
                    id: "conf-q-1",
                    title: "<p>Questions 5</p>",
                    qCode: dummyQcodes.confirmation,
                    positive: {
                      id: "pos-1",
                      label: "Yes",
                      description: "",
                    },
                    negative: {
                      id: "pos-2",
                      label: "No",
                      description: "",
                    },
                    __typename: "QuestionConfirmation",
                  },
                },
                {
                  id: "page-6",
                  pageType: "QuestionPage",
                  title: "<p>Questions 7</p>",
                  description: "",
                  answers: [
                    {
                      id: "ans-p6-1",
                      description: "",
                      guidance: "",
                      label: "",
                      qCode: "",
                      type: RADIO,
                      questionPageId: "qp-6",
                      options: [
                        {
                          id: "option-rad-1",
                          label: "Rad1",
                          description: null,
                          additionalAnswer: null,
                          qCode: "radio1",
                        },
                        {
                          id: "option-rad-2",
                          label: "Rad2",
                          description: null,
                          additionalAnswer: null,
                          qCode: "radio2",
                        },
                      ],
                    },
                  ],
                  routing: null,
                  alias: null,
                  sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
                },
                {
                  id: "page-7",
                  pageType: "QuestionPage",
                  title: "<p>Questions 8</p>",
                  description: "",
                  answers: [
                    {
                      id: "ans-p7-1",
                      description: "",
                      guidance: "",
                      label: "",
                      qCode: "1238",
                      type: CHECKBOX,
                      questionPageId: "29ceee38-5ba4-4f43-84ae-0162c5b175f8",
                      options: [
                        {
                          id: "option-cb-1",
                          label: "Either",
                          description: null,
                          additionalAnswer: null,
                          qCode: dummyQcodes.option,
                        },
                        {
                          id: "option-cb-3",
                          label: "Either 2",
                          description: null,
                          additionalAnswer: null,
                          qCode: "chk",
                        },
                      ],
                      mutuallyExclusiveOption: {
                        id: "option-cb-2",
                        label: "Or",
                        mutuallyExclusive: true,
                        description: null,
                        additionalAnswer: null,
                        qCode: dummyQcodes.mutuallyExclusive,
                      },
                    },
                  ],
                  sectionId: "c1a2aa31-ab46-456a-a1b8-a979c3c345de",
                },
              ],
            },
          ],
        },
      ],
    };

    props = {
      loading: false,
      data: {
        questionnaire,
      },
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
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          {Component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/qcode`,
        urlParamMatcher: "/q/:questionnaireId/qcode",
        mocks,
        ...rest,
      }
    );

  it("Should render a loading component", async () => {
    props = {
      ...props,
      loading: true,
    };
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const target = getByTestId("loading");
    expect(target).toBeTruthy();
  });

  it("Should render an error component", async () => {
    props = {
      ...props,
      error: { error: {} },
    };
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const target = getByTestId("error");
    expect(target).toBeTruthy();
  });

  it("Should render fields", async () => {
    const { getByText } = renderWithContext(<UnwrappedQCodeTable {...props} />);
    const fieldHeadings = [
      "Short code",
      "Question",
      "Type",
      "Answer label",
      "Qcode",
    ];
    fieldHeadings.forEach(heading => expect(getByText(heading)).toBeTruthy());
  });

  it("Should render rows equivalent to the amount of Questions", () => {
    const { getAllByText, getByText, getAllByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const renderedQuestions = getAllByText(content =>
      content.startsWith("Questions")
    );

    const confirmationQuestion = getByText("Questions 5");
    expect(confirmationQuestion).toBeTruthy();
    expect(getAllByText("Mutually exclusive checkbox").length).toEqual(2);
    expect(getByText("Embedded checkbox Either")).toBeTruthy();
    expect(getByText("Embedded checkbox Or")).toBeTruthy();
    expect(getByText("From")).toBeTruthy();
    expect(renderedQuestions.length).toEqual(7); // equal to non nested rows

    const answerRows = 21; // equal to answers present in questionnaire
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
    questionnaire.sections[0].folders[0].pages[0].answers[0].validationErrorInfo = {
      id: "b2422614-6700-42e1-88e8-2d993602d9b7",
      errors: [
        {
          id: "9350d8cf-e1cb-415d-98ba-dbe9770fa3c4",
          type: "answer",
          field: "qCode",
          errorCode: "ERR_VALID_REQUIRED",
          __typename: "ValidationError",
        },
      ],
      totalCount: 0,
      __typename: "ValidationErrorInfo",
    };

    props = {
      loading: false,
      data: {
        questionnaire,
      },
    };

    const { getByText } = await renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    await expect(getByText("Qcode required")).toBeTruthy();
  });

  it("Should not rerender if the qCode stays the same", () => {
    const { getByText, rerender } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    props.data.questionnaire.sections[0].folders[0].pages[0].answers[0].qCode =
      dummyQcodes.duplicate;

    rerender(<UnwrappedQCodeTable {...props} />);

    expect(getByText("num1")).toBeTruthy();
  });
});
