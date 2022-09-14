import React from "react";
import { render } from "tests/utils/rtl";
import { UnwrappedMainNavigation } from "./";
import { MeContext } from "App/MeContext";
import { QCodeContext } from "components/QCodeContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ questionnaireId: "questionnaire" }),
}));

jest.mock("react-apollo", () => ({
  ...jest.requireActual("react-apollo"),
  useSubscription: () => null,
}));

function defaultSetup({
  hasQCodeError = false,
  changes = {},
  user = {
    id: "123",
    displayName: "Batman",
    name: "Bruce",
    email: "IAmBatman@dccomics.com",
    __typename: "User",
    picture: "",
    admin: true,
  },
} = {}) {
  const props = {
    hasQuestionnaire: true,
    totalErrorCount: 0,
    match: { params: { modifier: "", questionnaireId: "1" } },
    loading: false,
    qcodesEnabled: true,
    formTypeErrorCount: 0,
    ...changes,
  };
  const utils = render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <QCodeContext.Provider value={{ hasQCodeError }}>
        <UnwrappedMainNavigation {...props} />
      </QCodeContext.Provider>
    </MeContext.Provider>
  );

  return { ...utils };
}

describe("MainNavigation", () => {
  it("should display platform badge", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("platform-badge")).toBeTruthy();
  });

  it("should display error badge when there is a qCode error", () => {
    const { getByTestId } = defaultSetup({ hasQCodeError: true });
    expect(getByTestId("small-badge")).toBeTruthy();
  });

  it("should display error badge when settings page has errors", () => {
    const { getByTestId } = defaultSetup({ changes: { settingsError: true } });
    expect(getByTestId("settings-error-badge")).toBeTruthy();
  });

  it("should not render button group if questionnaire is false", () => {
    const { queryByText } = defaultSetup({
      changes: { hasQuestionnaire: false },
    });
    expect(queryByText("Home")).toBeNull();
  });

  it("should enable all buttons if there are no errors on questionnaire", () => {
    const { getByTestId } = defaultSetup();

    expect(getByTestId("main-navigation")).toBeTruthy();
    expect(getByTestId("btn-view")).not.toBeDisabled();
    expect(getByTestId("btn-settings")).not.toBeDisabled();
    expect(getByTestId("btn-sharing")).not.toBeDisabled();
    expect(getByTestId("btn-history")).not.toBeDisabled();
    expect(getByTestId("btn-metadata")).not.toBeDisabled();
    expect(getByTestId("btn-qcodes")).not.toBeDisabled();
  });

  it("should disable qcodes, and publish buttons if there are errors on questionnaire", () => {
    const { getByTestId } = defaultSetup({ changes: { totalErrorCount: 2 } });
    expect(getByTestId("main-navigation")).toBeTruthy();

    expect(getByTestId("btn-view").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-settings").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-sharing").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-history").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-metadata").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-qcodes").hasAttribute("disabled")).toBeTruthy();
  });

  it("should NOT disable qcodes button if there is no surveyId", () => {
    const { getByTestId } = defaultSetup({ changes: { totalErrorCount: 1 } });
    expect(getByTestId("btn-qcodes").hasAttribute("disabled")).toBeFalsy();
  });

  it("should disable qcodes button if there is no surveyId BUT there is another error", () => {
    const { getByTestId } = defaultSetup({ changes: { totalErrorCount: 2 } });
    expect(getByTestId("btn-qcodes").hasAttribute("disabled")).toBeTruthy();
  });

  it("should enable qcodes button when qcodes are enabled", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("btn-qcodes").hasAttribute("disabled")).not.toBeTruthy();
  });

  it("should disable qcodes button when qcodes are not enabled", () => {
    const { getByTestId } = defaultSetup({ changes: { qcodesEnabled: false } });
    expect(getByTestId("btn-qcodes").hasAttribute("disabled")).toBeTruthy();
  });

  it("should display a sign-out button if user is logged in", () => {
    const { getByText } = defaultSetup();
    expect(getByText(/Sign out/)).toBeVisible();
  });

  it("should not display a sign-out button if user is logged in", () => {
    const { queryByText } = defaultSetup({ user: false });
    expect(queryByText(/Sign out/)).toBeNull();
  });
});
