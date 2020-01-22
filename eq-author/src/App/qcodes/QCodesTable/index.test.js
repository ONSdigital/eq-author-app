import React from "react";
import { render, fireEvent, act, flushPromises } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";
import { UnwrappedQCodeTable } from "./index";
import UPDATE_ANSWER_QCODE from "./UpdateAnswerMutation.graphql";
import UPDATE_OPTION_QCODE from "./UpdateOptionMutation.graphql";
import QuestionnaireContext from "components/QuestionnaireContext";

describe("Qcode Table", () => {
  let user, questionnaire, mocks, queryWasCalled, props, questionnaireId;

  beforeEach(() => {
    questionnaireId = "35b17858-cfac-4c66-80da-434ed2f995c3";

    questionnaire = {
      sections: [
        {
          pages: [
            {
              id: "e6ef75d8-4265-4de1-b8de-2e998e8f82b7",
              title: "<p>Test Radio Title</p>",
              alias: null,
              answers: [
                {
                  id: "fe317566-0870-4034-bd8e-703181b94bda",
                  label: "",
                  secondaryLabel: null,
                  type: "Radio",
                  qCode: "",
                  options: [
                    {
                      id: "53ab4c04-25fe-4143-ba8c-de5e13bc0031",
                      label: "Rad 1",
                      qCode: null,
                    },
                    {
                      id: "fc8e23c7-5fd7-407d-a299-26ce1544e250",
                      label: "Rad 2",
                      qCode: null,
                    },
                  ],
                  mutuallyExclusiveOption: null,
                },
              ],
            },
            {
              id: "d4d6fda4-197f-4769-829b-c6bac2eef323",
              title: "<p>Test Text Field</p>",
              alias: null,
              answers: [
                {
                  id: "ecc2931e-8a6c-419c-a40f-5715a3aafcc3",
                  label: "was",
                  secondaryLabel: null,
                  type: "TextField",
                  qCode: "123",
                  secondaryQCode: null,
                },
              ],
            },
            {
              id: "b1d1a299-0325-43e2-89f3-e83d7bf677b8",
              title: "<p>Test Checkbox</p>",
              alias: null,
              answers: [
                {
                  id: "2eea179d-79e1-42ac-b777-ded87e89e17f",
                  label: "Checkbox",
                  secondaryLabel: null,
                  type: "Checkbox",
                  qCode: "Checkbox",
                  options: [
                    {
                      id: "d8364ad6-82a1-4d7c-83a6-06303c99142c",
                      label: "Check test one",
                      qCode: "Checkbox 1",
                    },
                    {
                      id: "24a152aa-0890-43f5-ba5e-750e88a3d3a0",
                      label: "Check test two",
                      qCode: "Checkbox 2",
                    },
                    {
                      id: "12a152aa-0890-43f5-ba5e-750e88a3d3a0",
                      label: "Check test three",
                      qCode: "Checkbox 3",
                    },
                  ],
                  mutuallyExclusiveOption: null,
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
              id: "ecc2931e-8a6c-419c-a40f-5715a3aafcc3",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateAnswer: {
                id: "ecc2931e-8a6c-419c-a40f-5715a3aafcc3",
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
          query: UPDATE_OPTION_QCODE,
          variables: {
            input: {
              id: "12a152aa-0890-43f5-ba5e-750e88a3d3a0",
              qCode: "187",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              updateOption: {
                id: "12a152aa-0890-43f5-ba5e-750e88a3d3a0",
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
      error: true,
    };
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const target = getByTestId("error");
    expect(target).toBeTruthy();
  });

  it("Should render with data", async () => {
    props = {
      ...props,
    };
    const { getByText } = renderWithContext(<UnwrappedQCodeTable {...props} />);
    const targetText = getByText("Test Radio Title");

    expect(targetText).toBeTruthy();
  });

  it("Should render rows equivalent to the amount of Questions", () => {
    props = {
      ...props,
    };
    const questions = questionnaire.sections[0].pages;
    const numberOfQuestions = questions.length;
    const { getAllByText } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const renderedQuestions = getAllByText(content =>
      content.startsWith("Test")
    );
    expect(renderedQuestions.length).toEqual(numberOfQuestions);
  });

  it("Should render option rows equivalent to amount of question options", () => {
    const checkboxOptions =
      questionnaire.sections[0].pages[2].answers[0].options;
    const numberOfOptions = checkboxOptions.length;
    const { getAllByText } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const renderedOptions = getAllByText(content =>
      content.startsWith("Check test")
    );
    expect(renderedOptions.length).toEqual(numberOfOptions);
  });

  it("Should make query to update Answer", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );

    const testId = "ecc2931e-8a6c-419c-a40f-5715a3aafcc3-test-input";
    const originalValue = "123";
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

  it("Should make query to update Answer Option", async () => {
    const { getByTestId } = renderWithContext(
      <UnwrappedQCodeTable {...props} />
    );
    const testId = "12a152aa-0890-43f5-ba5e-750e88a3d3a0-test-input";
    const originalValue = "Checkbox 3";
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
});
