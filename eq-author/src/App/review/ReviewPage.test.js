import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import ReviewPage from "./ReviewPage";
import { MeContext } from "App/MeContext";
import actSilenceWarning from "tests/utils/actSilenceWarning";
import reviewQuestionnaireMutation from "./reviewQuestionnaire.graphql";
import { AWAITING_APPROVAL, PUBLISHED } from "constants/publishStatus";
import QuestionnaireContext from "components/QuestionnaireContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";

describe("Publish page", () => {
  let user, mocks, queryWasCalled, questionnaire;
  actSilenceWarning();

  const renderReviewPage = () =>
    render(
      <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          <ReviewPage />
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaire.id}/page/2`,
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );

  beforeEach(() => {
    questionnaire = {
      id: "Q1",
      publishStatus: AWAITING_APPROVAL,
      displayName: "Test questionnaire",
      totalErrorCount: 0,
      createdBy: {
        id: "1",
        name: "Morty",
        email: "what@ever.com",
      },
      editors: [],
    };
    user = {
      id: "123",
      displayName: "Awesome Tester",
      email: "test@jest.com",
      picture: "",
      admin: true,
    };
    queryWasCalled = false;
    mocks = [
      {
        request: {
          query: reviewQuestionnaireMutation,
          variables: {
            input: {
              questionnaireId: questionnaire.id,
              reviewAction: "Approved",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              reviewQuestionnaire: {
                id: "987-546-232",
                publishStatus: PUBLISHED,
                __typename: "Object",
              },
            },
          };
        },
      },
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: questionnaire.id },
        },
        result: () => ({
          data: {
            publishStatusUpdated: {
              id: questionnaire.id,
              publishStatus: "Unpublished",
              __typename: "Questionnaire",
            },
          },
        }),
      },
    ];
  });

  it("should fire a mutation to review the questionnaire when the 'Approve' button is pressed", async () => {
    const { getByTestId } = renderReviewPage();
    fireEvent.click(getByTestId("approve-review-btn"));
    await flushPromises();
    expect(queryWasCalled).toBeTruthy();
  });
  it("should redirect to homepage when questionnaire is approved", async () => {
    const { getByTestId, history } = renderReviewPage();
    fireEvent.click(getByTestId("approve-review-btn"));
    await flushPromises();
    expect(history.location.pathname).toBe(`/`);
  });
  it("should redirect to questionnaire when it is not awaiting approval", async () => {
    questionnaire.publishStatus = "Unpublished";
    const { history } = renderReviewPage();
    await flushPromises();
    expect(history.location.pathname).toBe(`/q/${questionnaire.id}`);
  });
});
