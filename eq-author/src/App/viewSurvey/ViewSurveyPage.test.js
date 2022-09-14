import React from "react";
import { render, act, flushPromises } from "tests/utils/rtl";
import ViewSurveyPage from "./ViewSurveyPage";
import { MeContext } from "App/MeContext";
import { publishStatusSubscription } from "components/EditorLayout/Header";

const renderViewSurveyPage = (questionnaire, props, user, mocks) => {
  return render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn(), props }}>
      <ViewSurveyPage {...props} />
    </MeContext.Provider>,
    {
      route: `/q/${questionnaire.id}/view-survey`,
      urlParamMatcher: "/q/:questionnaireId/view-survey",
      mocks,
    }
  );
};

describe("View Survey Page", () => {
  let questionnaire, props, user, mocks;

  beforeEach(() => {
    questionnaire = {
      id: "1",
      isPublic: true,
    };
    props = {
      match: { params: { modifier: "", questionnaireId: questionnaire.id } },
    };
    user = {
      id: "2",
      displayName: "TestName",
      email: "TEAmail@mail.com",
      picture: "",
      admin: true,
      name: "T",
      __typename: "User",
    };
    mocks = [
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

  it("should have correct title", () => {
    const { getByText } = renderViewSurveyPage(
      questionnaire,
      props,
      user,
      mocks
    );

    expect(getByText("View")).toBeTruthy();
  });

  it("should have correct scroll pane", () => {
    const { getByTestId } = renderViewSurveyPage(
      questionnaire,
      props,
      user,
      mocks
    );

    expect(getByTestId("view-page-content")).toBeTruthy();
  });

  it("should not disable preview button if there are no errors on the questionnaire", () => {
    // totalErrorCount = 0;
    // formTypeErrorCount = 0;
    const { getByTestId } = renderViewSurveyPage(
      questionnaire,
      props,
      user,
      mocks
    );

    expect(
      getByTestId("btn-open-in-electronic-questionnaire").hasAttribute(
        "disabled"
      )
    ).toBeFalsy();
  });

  it("should disable preview button if there are theme errors and other errors on the questionnaire", () => {
    // totalErrorCount = 2;
    // formTypeErrorCount = 1;
    const { getByTestId } = renderViewSurveyPage(
      questionnaire,
      props,
      user,
      mocks
    );

    expect(
      getByTestId("btn-open-in-electronic-questionnaire").hasAttribute(
        "disabled"
      )
    ).toBeTruthy();
  });

  it("should not disable preview button if there are only theme errors on the questionnaire", () => {
    // formTypeErrorCount = 1;
    const { getByTestId } = renderViewSurveyPage(
      questionnaire,
      props,
      user,
      mocks
    );

    expect(
      getByTestId("btn-open-in-electronic-questionnaire").hasAttribute(
        "disabled"
      )
    ).toBeFalsy();
  });

  afterEach(async () => {
    await act(async () => {
      await flushPromises();
    });
  });
});
