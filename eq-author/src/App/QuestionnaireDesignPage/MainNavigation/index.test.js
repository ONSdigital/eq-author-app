import React from "react";
import { render, flushPromises, act } from "tests/utils/rtl";
import { UnwrappedMainNavigation, publishStatusSubscription } from "./";
import { MeContext } from "App/MeContext";

describe("MainNavigation", () => {
  let props, user, mocks, questionnaire, signOut, onSubmit;
  beforeEach(() => {
    signOut = jest.fn();
    onSubmit = jest.fn();
    user = {
      id: "123",
      displayName: "Batman",
      name: "Bruce",
      email: "IAmBatman@dccomics.com",
      picture: "",
      admin: true,
    };
    const page = { id: "2", title: "Page", position: 0 };
    const section = { id: "3", title: "Section", pages: [page] };
    questionnaire = {
      id: "1",
      title: "Questionnaire",
      sections: [section],
      editors: [],
      createdBy: { ...user },
      totalErrorCount: 0,
    };
    props = {
      questionnaire,
      match: { params: { modifier: "", questionnaireId: questionnaire.id } },
      loading: false,
      signOut,
      onSubmit,
    };
    mocks = [
      {
        request: {
          query: publishStatusSubscription,
          variables: { id: props.match.params.questionnaireId },
        },
        result: () => {
          return {
            data: {
              publishStatusUpdated: {
                id: "1",
                publishStatus: "unpublished",
                __typename: "query",
              },
            },
          };
        },
      },
    ];
  });

  it("should enable all buttons if there are no errors on questionnaire", () => {
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <UnwrappedMainNavigation {...props} />
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    const nav = getByTestId("main-navigation");

    expect(nav).toBeTruthy();

    const viewSurveyBtn = getByTestId("btn-preview");
    const settingsBtn = getByTestId("btn-settings");
    const sharingBtn = getByTestId("btn-sharing");
    const historyBtn = getByTestId("btn-history");
    const metadataBtn = getByTestId("btn-metadata");
    const qcodesBtn = getByTestId("btn-qcodes");

    expect(viewSurveyBtn).not.toBeDisabled();
    expect(settingsBtn).not.toBeDisabled();
    expect(sharingBtn).not.toBeDisabled();
    expect(historyBtn).not.toBeDisabled();
    expect(metadataBtn).not.toBeDisabled();
    expect(qcodesBtn).not.toBeDisabled();
  });

  it("should disable qcodes, publish and preview buttons if there are errors on questionnaire", async () => {
    props.questionnaire.totalErrorCount = 1;

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <UnwrappedMainNavigation {...props} />
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    await act(async () => {
      flushPromises();
    });

    const nav = getByTestId("main-navigation");

    expect(nav).toBeTruthy();

    const viewSurveyBtn = getByTestId("btn-preview");
    const settingsBtn = getByTestId("btn-settings");
    const sharingBtn = getByTestId("btn-sharing");
    const historyBtn = getByTestId("btn-history");
    const metadataBtn = getByTestId("btn-metadata");
    const qcodesBtn = getByTestId("btn-qcodes");

    expect(viewSurveyBtn.hasAttribute("disabled")).toBeTruthy();
    expect(settingsBtn.hasAttribute("disabled")).toBeFalsy();
    expect(sharingBtn.hasAttribute("disabled")).toBeFalsy();
    expect(historyBtn.hasAttribute("disabled")).toBeFalsy();
    expect(metadataBtn.hasAttribute("disabled")).toBeFalsy();
    expect(qcodesBtn.hasAttribute("disabled")).toBeTruthy();
  });
});
