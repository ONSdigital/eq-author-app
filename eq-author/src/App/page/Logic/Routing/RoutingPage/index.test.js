import React from "react";
import { UnwrappedRoutingPage as RoutingPage, messages } from "./";
import { render, screen, fireEvent } from "tests/utils/rtl";
import QuestionnaireContext from "components/QuestionnaireContext";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

// Avoid testing as deeply as DestinationSelector (requires significantly more props & setup)
jest.mock("../DestinationSelector", () => () => <br />);

describe("Routing Page", () => {
  let questionnaire, page;
  beforeEach(() => {
    questionnaire = buildQuestionnaire({
      sectionCount: 1,
      folderCount: 1,
      pageCount: 2,
    });
    for (const page of questionnaire.sections[0].folders[0].pages) {
      page.section = questionnaire.sections[0];
      page.folder = questionnaire.sections[0].folders[0];
    }
    page = questionnaire.sections[0].folders[0].pages[0];
  });

  const renderWithContext = (children) =>
    render(
      <QuestionnaireContext.Provider value={{ questionnaire }}>
        {children}
      </QuestionnaireContext.Provider>
    );

  it("should show the no routing message when there is no routing for a page", () => {
    renderWithContext(<RoutingPage page={page} createRouting={jest.fn()} />);
    expect(screen.getByText(messages.NO_RULES_EXIST)).toBeTruthy();
  });

  it("should not allow adding routing to the last question in a questionnaire", () => {
    renderWithContext(
      <RoutingPage
        page={questionnaire.sections[0].folders[0].pages[1]}
        createRouting={jest.fn()}
      />
    );
    expect(screen.getByText(messages.LAST_PAGE)).toBeTruthy();
  });

  it("should call create routing with the page id when add routing button is clicked", () => {
    const createRouting = jest.fn();
    renderWithContext(
      <RoutingPage page={page} createRouting={createRouting} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(createRouting).toHaveBeenCalledWith(page.id);
  });

  it("should render the editor when routing rules are present", () => {
    page.routing = { id: "2", rules: [], else: null };
    renderWithContext(<RoutingPage page={page} createRouting={jest.fn()} />);
    expect(screen.getByText("Add rule")).toBeTruthy();
  });
});
