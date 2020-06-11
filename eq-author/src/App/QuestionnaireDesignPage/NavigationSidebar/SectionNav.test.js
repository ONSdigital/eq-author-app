import React from "react";
import { render } from "tests/utils/rtl";
import { withRouter } from "react-router-dom";

import SectionNav from "./SectionNav";

describe("SectionNav", () => {
  let Component;

  const page = {
    id: "2",
    title: "Page",
    displayName: "Page",
    validationErrorInfo: { totalCount: 2 },
  };
  const section = {
    id: "3",
    title: "Section",
    pages: [page],
    displayName: "Section",
    validationErrorInfo: { totalCount: 0 },
  };
  const questionnaire = {
    id: "1",
    title: "Questionnaire",
    sections: [section],
  };

  beforeEach(() => {
    Component = withRouter(SectionNav);
  });

  it("should render", () => {
    const { getByText } = render(
      <Component
        questionnaire={questionnaire}
        currentSectionId={section.id}
        currentPageId={page.id}
      />,
      {
        route: `/q/${questionnaire.id}`,
        urlParamMatcher: "/q/:questionnaireId",
      }
    );
    expect(getByText("Section")).toBeTruthy();
    expect(getByText("Page")).toBeTruthy();
  });
});
