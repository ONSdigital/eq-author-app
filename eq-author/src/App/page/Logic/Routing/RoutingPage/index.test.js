import React from "react";
import { UnwrappedRoutingPage as RoutingPage, messages } from "./";
import { render, screen, fireEvent } from "tests/utils/rtl";
import QuestionnaireContext from "components/QuestionnaireContext";

// Avoid testing as deeply as DestinationSelector (requires significantly more props & setup)
jest.mock("../DestinationSelector", () => () => <br />);

describe("Routing Page", () => {
  let questionnaire, page;

  const validationErrorInfo = {
    id: "1",
    totalCount: 0,
    errors: [],
  };

  const section = {
    id: "1",
    title: "Section 1",
    displayName: "Section 1",
    folders: [{ id: "1.1" }],
    position: 0,
    validationErrorInfo: validationErrorInfo,
  };

  const folder = {
    id: "1.1",
    alias: "Folder 1.1",
    enabled: false,
    position: 0,
    pages: [{ id: "1.1.1" }, { id: "1.1.2" }],
  };

  beforeEach(() => {
    questionnaire = {
      id: "questionnaire",
      title: "questionnaire",
      displayName: "questionnaire",
      sections: [
        {
          id: "1",
          title: "Section 1",
          displayName: "Section 1",
          folders: [
            {
              id: "1.1",
              alias: "Folder 1.1",
              enabled: false,
              position: 0,
              pages: [
                {
                  id: "1.1.1",
                  title: "Page 1.1.1",
                  displayName: "Page 1.1.1",
                  alias: "1.1.1",
                  position: 0,
                  routing: null,
                  validationErrorInfo: validationErrorInfo,
                  section: section,
                  folder: folder,
                },
                {
                  id: "1.1.2",
                  title: "Page 1.1.2",
                  displayName: "Page 1.1.2",
                  alias: "1.1.2",
                  position: 1,
                  routing: null,
                  validationErrorInfo: validationErrorInfo,
                  section: section,
                  folder: folder,
                },
              ],
            },
          ],
          position: 0,
          validationErrorInfo: validationErrorInfo,
        },
      ],
    };

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
