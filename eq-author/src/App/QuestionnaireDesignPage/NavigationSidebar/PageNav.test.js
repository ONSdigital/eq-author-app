import React from "react";
import { render } from "tests/utils/rtl";
import { withRouter } from "react-router-dom";
import PageNav from "./PageNav";

describe("PageNav", () => {
  let Component, handleDelete;

  const questionnaire = { id: "1", title: "Questionnaire" };
  const pages = [
    {
      id: "2",
      title: "Page",
      displayName: "Page",
      confirmation: {
        id: "4",
        title: "Confirmation Page",
        __typename: "QuestionConfirmation",
        displayName: "Confirmation page",
      },
    },
  ];
  const section = { id: "3", title: "Section", pages: pages, number: 1 };

  beforeEach(() => {
    handleDelete = jest.fn(() => Promise.resolve());

    Component = withRouter(PageNav);
  });

  it("should render", () => {
    const { getByText } = render(
      <Component
        questionnaire={questionnaire}
        section={section}
        onDelete={handleDelete}
      />,
      {
        route: `/q/${questionnaire.id}`,
        urlParamMatcher: "/q/:questionnaireId",
      }
    );
    expect(getByText("Page")).toBeTruthy();
    expect(getByText("Confirmation page")).toBeTruthy();
  });
});
