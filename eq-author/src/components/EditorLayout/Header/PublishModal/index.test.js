import React from "react";

import { render, fireEvent, flushPromises } from "tests/utils/rtl";

import publishQuestionnaireQuery from "./publishQuestionnaire.graphql";
import PublishModal from "./";
import actSilenceWarning from "tests/utils/actSilenceWarning";

describe("PublishModal", () => {
  let props, questionnaire, mocks, queryWasCalled, originalAlert;

  // this is just a little hack to silence a warning that we'll get until we
  // upgrade to 16.9: https://github.com/facebook/react/pull/14853
  actSilenceWarning();

  beforeEach(() => {
    questionnaire = {
      id: "456",
    };
    props = {
      isOpen: true,
      onClose: jest.fn(),
      questionnaire: questionnaire,
    };
    originalAlert = window.alert;
    window.alert = jest.fn();
  });

  afterEach(async () => {
    window.alert = originalAlert;
  });

  it("should disable submit button when any fields are empty", () => {
    const { getByText, getByTestId } = render(<PublishModal {...props} />);
    const publishSurveyButton = getByText("Submit for approval");

    const surveyIdInput = getByTestId("survey-id-input");

    fireEvent.change(surveyIdInput, {
      target: { value: "123" },
    });

    expect(publishSurveyButton).toHaveAttribute("disabled");
  });

  it("should fire a request to publish questionnaire", async () => {
    queryWasCalled = false;
    mocks = [
      {
        request: {
          query: publishQuestionnaireQuery,
          variables: {
            input: {
              questionnaireId: questionnaire.id,
              surveyId: "123",
              formType: "123",
            },
          },
        },
        result: () => {
          queryWasCalled = true;
          return {
            data: {
              triggerPublish: {
                id: questionnaire.id,
                launchUrl: "https://best.url.com",
                __typename: "PublishRequest",
              },
            },
          };
        },
      },
    ];

    const { getByText, getByTestId } = render(<PublishModal {...props} />, {
      mocks,
    });

    const surveyIdInput = getByTestId("survey-id-input");
    const formTypeInput = getByTestId("form-type-input");

    fireEvent.change(surveyIdInput, {
      target: { value: "123" },
    });
    fireEvent.change(formTypeInput, {
      target: { value: "123" },
    });

    const publishSurveyButton = getByText("Submit for approval");

    fireEvent.click(publishSurveyButton);

    await flushPromises();

    expect(queryWasCalled).toBeTruthy();
    expect(window.alert).toHaveBeenCalledWith(
      "Your survey has been published at: https://best.url.com"
    );
  });
});
