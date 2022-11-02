import React from "react";
import { render, fireEvent, act, waitFor, screen } from "tests/utils/rtl";

import { PageHeader } from "./PageHeader";
import MovePageModal from "App/page/Design/MoveEntityModal";

import {
  buildQuestionnaire,
  buildSections,
} from "tests/utils/createMockQuestionnaire";

describe("Question Page Editor", () => {
  let props, questionnaire, section, page, match;
  //     {...mockHandlers}
  //     page={page}
  //     showMovePageDialog={false}
  //     showDeleteConfirmDialog={false}
  //     match={match}
  //     alertText="You sure about this?"
  //     {...props}

  const renderPageHeader = (props) => {
    return render(<PageHeader {...props} />);
  };

  jest.mock("App/page/Design/PageHeader", () => ({
    handleOpenMovePageDialog: jest.fn(),
  }));

  beforeEach(() => {
    questionnaire = buildQuestionnaire({ pageCount: 2 });
    section = questionnaire.sections[0];
    page = section.folders[0].pages[0];
    match = {
      params: {
        questionnaireId: questionnaire.id,
        sectionId: section.id,
        pageId: page.id,
      },
    };

    props = {
      onDeletePageConfirm: jest.fn(),
      onDeletePage: jest.fn(),
      onDuplicatePage: jest.fn(),
      onMovePage: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      handleCloseMovePageDialog: jest.fn(),
      showMovePageDialog: false,
      showDeleteConfirmDialog: false,
      alertText: "You sure about this?",
      page,
      match,
    };
  });

  it("should open delete modal", () => {
    const { getByTestId } = renderPageHeader(props);
    fireEvent.click(getByTestId("btn-delete"));
    expect(getByTestId("modal")).toBeInTheDocument();
  });

  it("should open move modal", async () => {
    const { debug, getByTestId } = renderPageHeader(props);

    fireEvent.click(getByTestId("btn-move"));

    expect(jest.fn()).toHaveBeenCalled();

    // await waitFor(() => {
    //   expect(getByTestId("move-modal")).toBeInTheDocument();
    // });
    debug();
    // fireEvent.click(getByTestId("btn-move"));
  });
});
