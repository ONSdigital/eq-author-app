import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import PublishPage from "./PublishPage";
import { MeContext } from "App/MeContext";
import actSilenceWarning from "tests/utils/actSilenceWarning";
import triggerPublishMutation from "./triggerPublish.graphql";
import { AWAITING_APPROVAL, UNPUBLISHED } from "constants/publishStatus";
import QuestionnaireContext from "components/QuestionnaireContext";

describe("Publish page", () => {
  let user, mocks, queryWasCalled, questionnaire;
  actSilenceWarning();

  const renderPublishPage = mocks =>
    render(
      <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          <PublishPage />
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: "/q/Q1/page/2",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );

  beforeEach(() => {
    questionnaire = {
      id: "Q1",
      publishStatus: UNPUBLISHED,
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
      displayName: "Raymond Holt",
      email: "RaymondHolt@TheNineNine.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };
    queryWasCalled = false;
    mocks = [
      {
        request: {
          query: triggerPublishMutation,
          variables: {
            input: {
              questionnaireId: questionnaire.id,
              surveyId: "123",
              formType: "456",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              triggerPublish: {
                id: "987-546-232",
                publishStatus: AWAITING_APPROVAL,
                __typename: "Object",
              },
            },
          };
        },
      },
    ];
  });

  it("should have the 'Publish' button disabled until all fields are populated", async () => {
    const { getByLabelText, getByTestId } = renderPublishPage();

    expect(getByLabelText("Form type").value).toBe("");
    expect(getByLabelText("Survey ID").value).toBe("");
    expect(getByTestId("publish-survey-button").disabled).toBeTruthy();
  });

  it("should enable the 'Publish' button when all fields are populated", async () => {
    const { getByTestId, getByLabelText } = renderPublishPage();

    fireEvent.change(getByLabelText("Form type"), { target: { value: "123" } });
    fireEvent.change(getByLabelText("Survey ID"), { target: { value: "456" } });

    expect(getByTestId("publish-survey-button").disabled).toBeFalsy();
  });

  it("should fire a mutation to publish the questionnaire when the 'Submit for approval' button is pressed", async () => {
    const { getByTestId, getByLabelText } = renderPublishPage(mocks);

    fireEvent.change(getByLabelText("Form type"), { target: { value: "456" } });
    fireEvent.change(getByLabelText("Survey ID"), { target: { value: "123" } });

    fireEvent.click(getByTestId("publish-survey-button"));

    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
  });
  it("should redirect to homepage when 'Submit for approval' is clicked", async () => {
    const { getByTestId, getByLabelText, history } = renderPublishPage(mocks);

    fireEvent.change(getByLabelText("Form type"), { target: { value: "456" } });
    fireEvent.change(getByLabelText("Survey ID"), { target: { value: "123" } });
    fireEvent.click(getByTestId("publish-survey-button"));

    await flushPromises();

    expect(history.location.pathname).toBe("/");
  });
  it("should redirect to questionnaire when it is not Unpublished", async () => {
    questionnaire.publishStatus = AWAITING_APPROVAL;
    const { history } = renderPublishPage(mocks);
    await flushPromises();
    expect(history.location.pathname).toBe(`/q/${questionnaire.id}`);
  });
});
