import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import actSilenceWarning from "tests/utils/actSilenceWarning";

import { MeContext } from "App/MeContext";
import QuestionnaireContext from "components/QuestionnaireContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import { AWAITING_APPROVAL, UNPUBLISHED } from "constants/publishStatus";

import PublishPage, { themes } from "./PublishPage";
import triggerPublishMutation from "./triggerPublish.graphql";

describe("Publish page", () => {
  let user, mocks, queryWasCalled, questionnaire;
  actSilenceWarning();

  const renderPublishPage = () =>
    render(
      <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          <PublishPage />
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
              formTypes: { ONS: "456" },
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              triggerPublish: {
                id: questionnaire.id,
                publishStatus: AWAITING_APPROVAL,
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

  it("should have the 'Publish' button disabled until themes are selected and all fields are populated", async () => {
    const { getByLabelText, getByTestId } = renderPublishPage();

    expect(getByTestId("publish-survey-button").disabled).toBeTruthy();

    fireEvent.change(getByLabelText("Survey ID"), { target: { value: "123" } });
    expect(getByTestId("publish-survey-button").disabled).toBeTruthy();

    fireEvent.click(getByLabelText(themes[0]));
    expect(getByTestId("publish-survey-button").disabled).toBeTruthy();

    fireEvent.change(getByTestId(`${themes[0]}-input`), {
      target: { value: "456" },
    });
    expect(getByTestId("publish-survey-button").disabled).toBeFalsy();
  });

  it("should fire a mutation to publish the questionnaire and redirect to homepage when the 'Submit for approval' button is pressed", async () => {
    const { getByLabelText, getByTestId, history } = renderPublishPage(mocks);

    fireEvent.change(getByLabelText("Survey ID"), { target: { value: "123" } });
    fireEvent.click(getByLabelText(themes[0]));
    fireEvent.change(getByTestId(`${themes[0]}-input`), {
      target: { value: "456" },
    });

    fireEvent.click(getByTestId("publish-survey-button"));

    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(history.location.pathname).toBe("/");
  });

  it("should redirect to questionnaire when it is not Unpublished", async () => {
    questionnaire.publishStatus = AWAITING_APPROVAL;
    const { history } = renderPublishPage();
    await flushPromises();
    expect(history.location.pathname).toBe(`/q/${questionnaire.id}`);
  });
});
