import React from "react";
import { render } from "tests/utils/rtl";
import { withRouter } from "react-router-dom";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

import SectionNav from "./SectionNav";

describe("SectionNav", () => {
  let Component, questionnaire;

  beforeEach(() => {
    Component = withRouter(SectionNav);
    questionnaire = buildQuestionnaire();
  });

  it("should render", () => {
    const { getByText } = render(
      <Component
        questionnaire={questionnaire}
        currentSectionId={questionnaire.sections[0]}
        currentPageId={questionnaire.sections[0].folders[0].pages[0]}
        isOpen={{ open: true }}
        handleChange={jest.fn()}
      />,
      {
        route: `/q/${questionnaire.id}`,
        urlParamMatcher: "/q/:questionnaireId",
      }
    );
    expect(getByText("Section 1")).toBeTruthy();
    expect(getByText("Page 1.1.1")).toBeTruthy();
  });
});
