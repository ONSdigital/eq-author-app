import React from "react";
import { render, fireEvent, flushPromises, act } from "tests/utils/rtl";

import { MeContext } from "App/MeContext";
import QuestionnaireContext from "components/QuestionnaireContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";
import { AWAITING_APPROVAL, UNPUBLISHED } from "constants/publishStatus";

import PublishPage, { themes } from "./PublishPage";
import triggerPublishMutation from "./triggerPublish.graphql";

describe("Publish page", () => {
  let user, mocks, queryWasCalled, questionnaire;

  const renderPublishPage = () =>
    render(
      <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
        <QuestionnaireContext.Provider value={{ questionnaire }}>
          <PublishPage />
        </QuestionnaireContext.Provider>
      </MeContext.Provider>,
      {
        route: `/q/${questionnaire.id}/publish`,
        urlParamMatcher: "/q/:questionnaireId",
        mocks,
      }
    );

  afterEach(async () => {
    await act(async () => {
      flushPromises();
    });
  });

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
      editors: [{ id: "2", name: "Rick", email: "rick@mail.com" }],
      permission: "Write",
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
              variants: [{ theme: "ONS", formType: "456" }],
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
    await act(async () => {
      flushPromises();
    });
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

    await act(async () => {
      await fireEvent.change(getByLabelText("Survey ID"), {
        target: { value: "123" },
      });
      await fireEvent.click(getByLabelText(themes[0]));
      await fireEvent.change(getByTestId(`${themes[0]}-input`), {
        target: { value: "456" },
      });
      await fireEvent.click(getByTestId("publish-survey-button"));
    });

    expect(queryWasCalled).toBeTruthy();
    expect(history.location.pathname).toBe("/");
  });

  it("should redirect to questionnaire when it is not Unpublished", () => {
    questionnaire.publishStatus = AWAITING_APPROVAL;
    const { history } = renderPublishPage();
    expect(history.location.pathname).toBe(`/q/${questionnaire.id}`);
  });

  it("should not redirect to questionnaire when user is owner", () => {
    questionnaire.publishStatus = UNPUBLISHED;
    user = { ...user, id: "1", admin: false };
    const { history } = renderPublishPage();
    expect(history.location.pathname).toBe(`/q/${questionnaire.id}/publish`);
  });

  it("should not redirect to questionnaire when user is editor", () => {
    questionnaire.publishStatus = UNPUBLISHED;
    user = { ...user, id: "2", admin: false };
    const { history } = renderPublishPage();
    expect(history.location.pathname).toBe(`/q/${questionnaire.id}/publish`);
  });
});
