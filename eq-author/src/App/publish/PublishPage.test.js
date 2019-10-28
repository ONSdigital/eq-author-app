import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import PublishPage from "./PublishPage";
import { MeContext } from "App/MeContext";
import actSilenceWarning from "tests/utils/actSilenceWarning";
import TRIGGER_PUBLISH_QUERY from "./publishQuestionnaire.graphql";

describe("Publish page", () => {
  let user, questionnaireId, originalAlert;
  actSilenceWarning();
  const renderPublishPage = mocks =>
    render(
      <MeContext.Provider value={{ me: user }}>
        <PublishPage />
      </MeContext.Provider>,
      {
        route: "/q/Q1/page/2",
        urlParamMatcher: "/q/:questionnaireId/page/:pageId",
        mocks,
      }
    );
  beforeAll(() => {
    originalAlert = window.alert;
    window.alert = jest.fn();
  });
  beforeEach(() => {
    questionnaireId = "Q1";
    user = {
      id: "123",
      displayName: "Raymond Holt",
      email: "RaymondHolt@TheNineNine.com",
      picture: "http://img.com/avatar.jpg",
      admin: true,
    };
  });
  afterAll(() => {
    window.alert = originalAlert;
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

  it("should fire a query to publish the questionnaire when the 'Publish' button is pressed and clear the form", async () => {
    let queryWasCalled = false;

    const mocks = [
      {
        request: {
          query: TRIGGER_PUBLISH_QUERY,
          variables: {
            input: {
              questionnaireId: questionnaireId,
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
                launchUrl: "https://en.wikipedia.org/wiki/Spoon_theory",
                __typename: "Object",
              },
            },
          };
        },
      },
    ];

    const { getByTestId, getByLabelText } = renderPublishPage(mocks);

    fireEvent.change(getByLabelText("Form type"), { target: { value: "456" } });
    fireEvent.change(getByLabelText("Survey ID"), { target: { value: "123" } });

    fireEvent.click(getByTestId("publish-survey-button"));

    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(getByLabelText("Form type").value).toBe("");
    expect(getByLabelText("Survey ID").value).toBe("");
  });
});
