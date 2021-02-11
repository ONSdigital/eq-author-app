import React from "react";
import { render, fireEvent, flushPromises, act } from "tests/utils/rtl";
import ReviewPage from "./ReviewPage";
import { MeContext } from "App/MeContext";
import reviewQuestionnaireMutation from "./reviewQuestionnaire.graphql";
import {
  AWAITING_APPROVAL,
  UPDATES_REQUIRED,
  PUBLISHED,
} from "constants/publishStatus";
import QuestionnaireContext from "components/QuestionnaireContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";

//eslint-disable-next-line react/prop-types
jest.mock("components/RichTextEditor", () => ({ onUpdate }) => {
  const handleInputChange = (event) =>
    onUpdate({
      value: event.target.value,
    });
  return (
    <input data-test="reject-comment-input" onChange={handleInputChange} />
  );
});

describe("Review page", () => {
  let user, mocks, queryWasCalled, questionnaire;

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
  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });

  describe("Approve", () => {
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
      await act(async () => {
        await flushPromises();
      });
      expect(queryWasCalled).toBeTruthy();
    });
    it("should redirect to homepage when questionnaire is approved", async () => {
      const { getByTestId, history } = renderReviewPage();
      await act(async () => {
        await fireEvent.click(getByTestId("approve-review-btn"));
        await flushPromises();
      });
      expect(history.location.pathname).toBe(`/`);
    });
    it("should redirect to questionnaire when it is not awaiting approval", async () => {
      questionnaire.publishStatus = "Unpublished";
      const { history } = renderReviewPage();
      await flushPromises();
      expect(history.location.pathname).toBe(`/q/${questionnaire.id}`);
    });
  });

  describe("Reject", () => {
    beforeEach(() => {
      questionnaire = {
        id: "Q1",
        publishStatus: AWAITING_APPROVAL,
        displayName: "Shantay you stay",
        totalErrorCount: 0,
        createdBy: {
          id: "1968",
          name: "Michelle Visage",
          email: "SlayGurl@outlook.com",
        },
        editors: [],
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
            query: reviewQuestionnaireMutation,
            variables: {
              input: {
                questionnaireId: questionnaire.id,
                reviewAction: "Rejected",
                reviewComment: "You need to add a question about lip-syncing",
              },
            },
          },
          result: () => {
            queryWasCalled = true;
            return {
              data: {
                reviewQuestionnaire: {
                  id: "987-546-232",
                  publishStatus: UPDATES_REQUIRED,
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
    it("should render the 'Reject' button disabled if a reject comment has not been entered", () => {
      const { getByTestId } = renderReviewPage(mocks);
      const btn = getByTestId("reject-review-btn");
      expect(btn.disabled).toBeTruthy();
    });
    it("should render the 'Reject' button enabled if a reject comment has been entered", () => {
      const { getByTestId } = renderReviewPage(mocks);
      const input = getByTestId("reject-comment-input");
      fireEvent.change(input, {
        target: { value: "You need to add a question about lip-syncing" },
      });
      const btn = getByTestId("reject-review-btn");
      expect(btn.disabled).toBeFalsy();
    });
    it("should fire a mutation when the 'Reject' button is pressed", async () => {
      const { getByTestId } = renderReviewPage(mocks);
      const input = getByTestId("reject-comment-input");
      fireEvent.change(input, {
        target: { value: "You need to add a question about lip-syncing" },
      });

      const btn = getByTestId("reject-review-btn");
      await act(async () => {
        await fireEvent.click(btn);
        await flushPromises();
      });
      expect(queryWasCalled).toBeTruthy();
    });
  });
});
