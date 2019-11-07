import React from "react";
import { render, flushPromises, fireEvent } from "tests/utils/rtl";
import actSilenceWarning from "tests/utils/actSilenceWarning";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";

import HistoryPageContent from "./HistoryPage";

import questionnaireHistoryQuery from "./questionnaireHistory.graphql";
import createHistoryNoteMutation from "./createHistoryNoteMutation.graphql";
import { publishStatusSubscription } from "components/EditorLayout/Header";

import { UNPUBLISHED } from "constants/publishStatus";

//eslint-disable-next-line react/prop-types
jest.mock("components/RichTextEditor", () => ({ onUpdate }) => {
  const handleInputChange = event =>
    onUpdate({
      value: event.target.value,
    });
  return <input data-test="textbox" onChange={handleInputChange} />;
});

describe("History page", () => {
  let props, questionnaireId, user, queryWasCalled, mutationWasCalled, mocks;

  actSilenceWarning();

  beforeEach(() => {
    questionnaireId = "1";
    queryWasCalled = false;
    mutationWasCalled = false;

    props = {
      match: {
        params: {
          questionnaireId,
        },
      },
      data: {
        questionnaire: {
          id: questionnaireId,
        },
      },
    };

    user = {
      id: "123",
      displayName: "Rick Sanchez",
      email: "wubbalubba@dubdub.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };

    mocks = [
      {
        request: {
          query: questionnaireHistoryQuery,
          variables: { input: { questionnaireId } },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              history: [
                {
                  id: "161deb98-fdbe-4906-aea5-39d3de2d78a2",
                  publishStatus: "Questionnaire created",
                  questionnaireTitle: "Test 2",
                  bodyText: null,
                  user: {
                    id: "7c0abf65-9c8f-491c-bcd5-76f53f3983a9",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:48:28.584Z",
                  __typename: "History",
                },
                {
                  id: "aa94b4ef-e717-40b6-aba5-7c99557d283c",
                  publishStatus: UNPUBLISHED,
                  questionnaireTitle: "Test 2",
                  bodyText: "Hello Moto",
                  user: {
                    id: "7c0abf65-9c8f-491c-bcd5-76f53f3983a9",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:49:16.636Z",
                  __typename: "History",
                },
              ],
            },
          };
        },
      },
      {
        request: {
          query: createHistoryNoteMutation,
          variables: {
            input: {
              id: props.match.params.questionnaireId,
              bodyText: "New note",
            },
          },
        },
        result: () => {
          mutationWasCalled = true;
          return {
            data: {
              createHistoryNote: [
                {
                  id: "161deb98-fdbe-4906-aea5-39d3de2d78a2",
                  publishStatus: "Questionnaire created",
                  questionnaireTitle: "Test 2",
                  bodyText: null,
                  user: {
                    id: "7c0abf65-9c8f-491c-bcd5-76f53f3983a9",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:48:28.584Z",
                  __typename: "History",
                },
                {
                  id: "aa94b4ef-e717-40b6-aba5-7c99557d283c",
                  publishStatus: UNPUBLISHED,
                  questionnaireTitle: "Test 2",
                  bodyText: "Hello Moto",
                  user: {
                    id: "7c0abf65-9c8f-491c-bcd5-76f53f3983a9",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:49:16.636Z",
                  __typename: "History",
                },
                {
                  id: "48c2c4ca-9935-4ee4-98fd-7f2387fe8fea",
                  publishStatus: UNPUBLISHED,
                  questionnaireTitle: "Test 2",
                  bodyText: "New note",
                  user: {
                    id: "7c0abf65-9c8f-491c-bcd5-76f53f3983a9",
                    email: "sam@hello.com",
                    name: "sam",
                    displayName: "sam",
                    __typename: "User",
                  },
                  time: "2019-10-11T09:49:21.247Z",
                  __typename: "History",
                },
              ],
            },
          };
        },
      },
      {
        request: {
          query: publishStatusSubscription,
          variables: {
            id: questionnaireId,
          },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaireId,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  const renderWithContext = component =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <QuestionnaireContext.Provider value={props.data.questionnaire}>
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaireId}/page/2`,
        urlParamMatcher: "/q/:questionnaireId",
        mocks,
      }
    );

  it("renders History page with correct events", async () => {
    const { getByText } = renderWithContext(<HistoryPageContent {...props} />);
    await flushPromises();
    expect(getByText("History")).toBeTruthy();
    expect(getByText("Questionnaire created")).toBeTruthy();
    expect(getByText("Hello Moto")).toBeTruthy();
  });

  it("can create a note", async () => {
    const { getByText, getByTestId } = renderWithContext(
      <HistoryPageContent {...props} />
    );
    await flushPromises();
    fireEvent.change(getByTestId("textbox"), {
      target: { value: "New note" },
    });
    fireEvent.click(getByTestId("add-note-btn"));

    await flushPromises();

    expect(getByText("Questionnaire created")).toBeTruthy();
    expect(getByText("Hello Moto")).toBeTruthy();
    expect(getByText("New note")).toBeTruthy();
  });

  it("wont create an empty note", async () => {
    const { getByTestId } = renderWithContext(
      <HistoryPageContent {...props} />
    );
    await flushPromises();
    fireEvent.click(getByTestId("add-note-btn"));
    await flushPromises();
    expect(mutationWasCalled).toBeFalsy();
  });

  it("should request questionnaire history", async () => {
    queryWasCalled = false;
    renderWithContext(<HistoryPageContent {...props} />);
    await flushPromises();
    expect(queryWasCalled).toBeTruthy();
  });

  it("should render loading state", () => {
    const { getByTestId } = renderWithContext(
      <HistoryPageContent {...props} />
    );
    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state", async () => {
    mocks[0] = {
      request: {
        query: questionnaireHistoryQuery,
        variables: { input: { questionnaireId } },
      },
      result: () => ({ error: {} }),
    };

    const { getByText } = renderWithContext(<HistoryPageContent {...props} />);
    await flushPromises();
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });
});
