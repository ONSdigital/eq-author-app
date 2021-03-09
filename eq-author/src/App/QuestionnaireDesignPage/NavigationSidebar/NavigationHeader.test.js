import React from "react";
import { render, fireEvent, waitFor, screen } from "tests/utils/rtl";
// import userEvent from "@testing-library/user-event";

import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import QuestionnaireContext from "components/QuestionnaireContext";

import NavigationHeader from "./NavigationHeader";

jest.mock("components/NavigationCallbacks", () => ({
  useNavigationCallbacks: () => ({
    onAddQuestionPage: null,
    onAddFolder: jest.fn(),
    onAddCalculatedSummaryPage: jest.fn(),
  }),
}));

// jest.mock("react-router-dom", () => ({
//   useParams: () => ({ entityName: "something" }),
// }));

function defaultSetup(changes) {
  const props = {
    ...changes,
  };
  const questionnaire = buildQuestionnaire();
  const utils = render(
    <QuestionnaireContext.Provider value={questionnaire}>
      <NavigationHeader {...props} />
    </QuestionnaireContext.Provider>
  );

  return { ...utils };
}

function openSetup() {
  const utils = defaultSetup();
  const menuButton = "btn-add-menu";
  fireEvent.click(utils.getByTestId(menuButton));
  return { ...utils };
}

describe("NavigationHeader", () => {
  it("should render", () => {
    const { getByTestId } = defaultSetup();
    expect(getByTestId("btn-add-menu")).toBeVisible();
  });

  it("should open up menu", () => {
    const { queryByTestId } = defaultSetup();
    expect(queryByTestId("addmenu-window")).toBeNull();
    fireEvent.click(queryByTestId("btn-add-menu"));
    expect(queryByTestId("addmenu-window")).toBeVisible();
  });

  it("should close after firing", async () => {
    const { queryByTestId, debug } = openSetup();
    fireEvent.click(queryByTestId("btn-add-question-page"));
    debug();
    await waitFor(expect(screen.queryByTestId("addmenu-window")).toBeNull());
  });
});
