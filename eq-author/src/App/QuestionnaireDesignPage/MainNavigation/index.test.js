import React from "react";
import { render } from "tests/utils/rtl";
import { UnwrappedMainNavigation } from "./";
import { MeContext } from "App/MeContext";
import { QCodeContext } from "components/QCodeContext";
import { buildAnswers } from "tests/utils/createMockQuestionnaire";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ questionnaireId: "questionnaire" }),
}));

jest.mock("react-apollo", () => ({
  ...jest.requireActual("react-apollo"),
  useSubscription: () => null,
}));

const flatAnswers = () => {
  const flattenedAnswers = buildAnswers({ answerCount: 5 });
  flattenedAnswers.map((item, index) => {
    if (index > 0) {
      item.nested = true;
    }
    item.title = "<p>Questions 1</p>";
    item.type = "Number";
    item.qCode = "123";
    item.label = `${item.type}-${index}`;
    return item;
  });
  return flattenedAnswers;
};

function defaultSetup({
  flat = flatAnswers(),
  duplicateQCode = false,
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
    ...changes,
  };
  const utils = render(
    <MeContext.Provider value={{ me: user, signOut: jest.fn() }}>
      <QCodeContext.Provider value={{ flattenedAnswers: flat, duplicateQCode }}>
        <UnwrappedMainNavigation {...props} />
      </QCodeContext.Provider>
    </MeContext.Provider>
  );

  return { ...utils };
}

describe("MainNavigation", () => {
  it("should display error badge when qCode is empty", () => {
    const flat = flatAnswers();
    flat[0].qCode = "";
    const { getByTestId } = defaultSetup({ flat });

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

  it("should provide the validation error dot for the QCodes tab if there are duplicate qCodes", () => {
    const { getByTestId } = defaultSetup({ duplicateQCode: true });

    expect(getByTestId("small-badge")).toBeTruthy();
  });

  it("should enable all buttons if there are no errors on questionnaire", () => {
    const { getByTestId } = defaultSetup();

    expect(getByTestId("main-navigation")).toBeTruthy();

    expect(getByTestId("btn-preview")).not.toBeDisabled();
    expect(getByTestId("btn-settings")).not.toBeDisabled();
    expect(getByTestId("btn-sharing")).not.toBeDisabled();
    expect(getByTestId("btn-history")).not.toBeDisabled();
    expect(getByTestId("btn-metadata")).not.toBeDisabled();
    expect(getByTestId("btn-qcodes")).not.toBeDisabled();
  });

  it("should disable qcodes, publish and preview buttons if there are errors on questionnaire", () => {
    const { getByTestId } = defaultSetup({ changes: { totalErrorCount: 1 } });
    expect(getByTestId("main-navigation")).toBeTruthy();

    expect(getByTestId("btn-preview").hasAttribute("disabled")).toBeTruthy();
    expect(getByTestId("btn-settings").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-sharing").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-history").hasAttribute("disabled")).toBeFalsy();
    expect(getByTestId("btn-metadata").hasAttribute("disabled")).toBeFalsy();
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
