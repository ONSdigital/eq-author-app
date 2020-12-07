import React from "react";
import { render } from "tests/utils/rtl";
import { withRouter } from "react-router-dom";
import PageNav from "./PageNav";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

describe("PageNav", () => {
  let Component, handleDelete;

  const questionnaire = buildQuestionnaire();
  questionnaire.sections[0].folders[0].pages[0].confirmation = {
    id: "4",
    title: "Confirmation Page",
    __typename: "QuestionConfirmation",
    displayName: "Confirmation page",
  };

  beforeEach(() => {
    handleDelete = jest.fn(() => Promise.resolve());
    Component = withRouter(PageNav);
  });

  it("should render", () => {
    const { getByText } = render(
      <Component
        questionnaire={questionnaire}
        section={questionnaire.sections[0]}
        onDelete={handleDelete}
      />,
      {
        route: `/q/${questionnaire.id}`,
        urlParamMatcher: "/q/:questionnaireId",
      }
    );
    expect(getByText("Page 1.1.1")).toBeTruthy();
    expect(getByText("Confirmation page")).toBeTruthy();
  });
});
