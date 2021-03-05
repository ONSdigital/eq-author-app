import React from "react";
import { render } from "tests/utils/rtl";
import { UnwrappedMainNavigation, publishStatusSubscription } from "./";
import { MeContext } from "App/MeContext";
import { QCodeContext } from "components/QCodeContext";

describe("MainNavigation", () => {
  let props, user, mocks, flattenedAnswers, duplicateQCode, signOut, onSubmit;

  beforeEach(() => {
    signOut = jest.fn();
    onSubmit = jest.fn();
    user = {
      id: "123",
      displayName: "Batman",
      name: "Bruce",
      email: "IAmBatman@dccomics.com",
      __typename: "User",
      picture: "",
      admin: true,
      signOut: jest.fn(),
    };
    props = {
      hasQuestionnaire: true,
      totalErrorCount: 0,
      match: { params: { modifier: "", questionnaireId: "1" } },
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
    flattenedAnswers = [
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        id: "ans-p1-1",
        description: "",
        guidance: "",
        label: "num1",
        qCode: "123",
        secondaryQCode: "1",
        type: "Number",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-2",
        description: "",
        guidance: "",
        label: "curr1",
        qCode: "123",
        secondaryQCode: "2",
        type: "Currency",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-3",
        description: "",
        guidance: "",
        label: "Un1",
        qCode: "1",
        secondaryQCode: "3",
        type: "Unit",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-4",
        description: "",
        guidance: "",
        label: "Per1",
        qCode: "www",
        secondaryQCode: "4",
        type: "Percentage",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
      {
        title: "<p>Questions 1</p>",
        alias: undefined,
        nested: true,
        id: "ans-p1-5",
        description: "",
        guidance: "",
        label: "Dur1",
        qCode: "qCode3",
        secondaryQCode: "5",
        type: "Duration",
        questionPageId: "qp-1",
        secondaryLabel: null,
      },
    ];
    duplicateQCode = false;
  });

  it("should display error badge when qCode is empty", async () => {
    flattenedAnswers[0].qCode = "";

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QCodeContext.Provider value={{ flattenedAnswers, duplicateQCode }}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    expect(getByTestId("small-badge")).toBeTruthy();
  });

  it("should provide the validation error dot for the QCodes tab if there are duplicate qCodes", async () => {
    duplicateQCode = true;

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QCodeContext.Provider value={{ flattenedAnswers, duplicateQCode }}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    expect(getByTestId("small-badge")).toBeTruthy();
  });

  it("should enable all buttons if there are no errors on questionnaire", () => {
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QCodeContext.Provider value={{ flattenedAnswers, duplicateQCode }}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
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
    props.totalErrorCount = 1;
    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QCodeContext.Provider value={{ flattenedAnswers, duplicateQCode }}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
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

    expect(viewSurveyBtn.hasAttribute("disabled")).toBeTruthy();
    expect(settingsBtn.hasAttribute("disabled")).toBeFalsy();
    expect(sharingBtn.hasAttribute("disabled")).toBeFalsy();
    expect(historyBtn.hasAttribute("disabled")).toBeFalsy();
    expect(metadataBtn.hasAttribute("disabled")).toBeFalsy();
    expect(qcodesBtn.hasAttribute("disabled")).toBeTruthy();
  });

  it("should provide the validation error dot for the QCodes tab if there is an empty qCode", async () => {
    flattenedAnswers[0].qCode = "";

    const { getByTestId } = render(
      <MeContext.Provider value={{ me: user, signOut }}>
        <QCodeContext.Provider value={{ flattenedAnswers, duplicateQCode }}>
          <UnwrappedMainNavigation {...props} />
        </QCodeContext.Provider>
      </MeContext.Provider>,
      {
        mocks,
      }
    );

    expect(getByTestId("small-badge")).toBeTruthy();
  });
});
