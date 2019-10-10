import React from "react";
import { render, flushPromises } from "tests/utils/rtl";
import actSilenceWarning from "tests/utils/actSilenceWarning";

import QuestionnaireContext from "components/QuestionnaireContext";
import { MeContext } from "App/MeContext";

import UnwrappedHistoryPageContent from "./HistoryPage";

import questionnaireHistoryQuery from "./questionnaireHistory.graphql";

describe("History page", () => {
  let props, questionnaireId, user, queryWasCalled, mocks;

  actSilenceWarning();

  beforeEach(() => {
    questionnaireId = "1";

    props = {
      match: {
        params: {
          questionnaireId: questionnaireId,
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
          variables: {
            input: { questionnaireId: props.match.params.questionnaireId },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              questionnaire: {
                id: "5d9d056a-bd15-4a7e-a673-eb414d9ed821",
                createdBy: {
                  id: "7e9a586e-2d7a-4170-ae9f-7111656999b1",
                  displayName: "Jason Humphries",
                  __typename: "User",
                },
                createdAt: "2019-09-26T10:22:58.461Z",
                title: "This is a long title for testing stuff",
                __typename: "Questionnaire",
              },
            },
          };
        },
      },
    ];
  });

  const renderWithContext = (component, ...rest) =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <QuestionnaireContext.Provider value={props.data.questionnaire}>
          {component}
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      ...rest
    );

  it("renders History page", async () => {
    const { getByText } = renderWithContext(
      <UnwrappedHistoryPageContent {...props} />,
      {
        mocks,
      }
    );
    await flushPromises();
    expect(getByText("History")).toBeTruthy();
  });
  it("should request questionnaire history", async () => {
    queryWasCalled = false;
    renderWithContext(<UnwrappedHistoryPageContent {...props} />, {
      mocks,
    });
    await flushPromises();
    expect(queryWasCalled).toBeTruthy();
  });

  it("should render loading state", () => {
    props = {
      ...props,
      loading: true,
    };

    const { getByTestId } = renderWithContext(
      <UnwrappedHistoryPageContent {...props} />
    );

    expect(getByTestId("loading")).toBeTruthy();
  });

  it("should render error state", async () => {
    props = {
      ...props,
      error: {},
    };

    const { getByText } = renderWithContext(
      <UnwrappedHistoryPageContent {...props} />
    );
    await flushPromises();
    expect(getByText("Oops! Something went wrong")).toBeTruthy();
  });
});
