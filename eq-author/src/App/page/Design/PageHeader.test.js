import React from "react";
import { shallow } from "enzyme";
import { PageHeader } from "./PageHeader";
import {
  buildQuestionnaire,
  buildSections,
} from "tests/utils/createMockQuestionnaire";
import MovePageModal from "App/page/Design/MoveEntityModal";

describe("Question Page Editor", () => {
  let wrapper, mockHandlers, page, mockEvent, questionnaire, match;

  const render = ({ ...props }) => {
    return shallow(
      <PageHeader
        {...mockHandlers}
        page={page}
        showMovePageDialog={false}
        showDeleteConfirmDialog={false}
        match={match}
        alertText="You sure about this?"
        {...props}
      />
    );
  };

  beforeEach(() => {
    mockHandlers = {
      onDeletePageConfirm: jest.fn(),
      onDeletePage: jest.fn(),
      onDuplicatePage: jest.fn(),
      onMovePage: jest.fn(),
      onChange: jest.fn(),
      onUpdate: jest.fn(),
      handleCloseMovePageDialog: jest.fn(),
    };

    mockEvent = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    questionnaire = buildQuestionnaire();
    const section = questionnaire.sections[0];
    page = section.folders[0].pages[0];
    match = {
      params: {
        questionnaireId: questionnaire.id,
        sectionId: section.id,
        pageId: page.id,
      },
    };

    wrapper = render({});
  });

  it("should open delete dialog", () => {
    wrapper = render({ questionnaire });
    wrapper.find("[data-test='btn-delete']").simulate("click");
    expect(wrapper.state("showDeleteConfirmDialog")).toEqual(true);
  });

  it("should open move dialog", () => {
    wrapper = render({ questionnaire });
    wrapper.find("[data-test='btn-move']").simulate("click");
    expect(wrapper.state("showMovePageDialog")).toEqual(true);
  });

  describe("DeleteConfirmDialog", () => {
    let deleteConfirmDialog;

    beforeEach(() => {
      wrapper = render();
      wrapper.setState({ showDeleteConfirmDialog: true });
      deleteConfirmDialog = wrapper.find("DeleteConfirmDialog");
    });

    it("should display delete confirm dialog", () => {
      expect(deleteConfirmDialog.props().isOpen).toBe(true);
    });

    it("should call handler when confirmed", () => {
      deleteConfirmDialog.simulate("delete");
      expect(mockHandlers.onDeletePage).toHaveBeenCalled();
    });

    it("should call handler when closed", () => {
      deleteConfirmDialog.simulate("close");
      expect(wrapper.state("showDeleteConfirmDialog")).toEqual(false);
    });
  });

  describe("Duplicate", () => {
    it("should call duplicate with the correct parameters", () => {
      wrapper = render();
      wrapper
        .find(`[data-test="btn-duplicate-page"]`)
        .first()
        .simulate("click", mockEvent);

      expect(mockHandlers.onDuplicatePage).toHaveBeenCalledWith({
        pageId: page.id,
        position: parseInt(page.position, 10) + 1,
        sectionId: page.section.id,
      });
    });
  });

  describe("Move", () => {
    beforeEach(() => {
      wrapper = render();
      wrapper.setState({ showMovePageDialog: true });
    });

    it("should display page modal", () => {
      const moveWrapper = wrapper.find(MovePageModal);
      expect(moveWrapper.prop("isOpen")).toEqual(true);
    });

    it("should call handler when confirmed", () => {
      const moveWrapper = wrapper.find(MovePageModal);
      moveWrapper.props().onMove();
      expect(mockHandlers.onMovePage).toHaveBeenCalled();
    });

    it("should call handler when closed", () => {
      const moveWrapper = wrapper.find(MovePageModal);
      moveWrapper.simulate("close");
      expect(wrapper.state("showMovePageDialog")).toEqual(false);
    });

    it("should disable move when only one question", () => {
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
                    section: {
                      id: "1",
                    },
                    folder: {
                      id: "1",
                    },
                  },
                ],
                section: {
                  id: "1",
                },
              },
            ],
            position: 0,
          },
        ],
      };
      wrapper = render({ questionnaire });
      const button = wrapper.find("[data-test='btn-move']").prop("disabled");

      expect(button).toBeTruthy();
    });

    it("should enable move when more than one question", () => {
      questionnaire.sections = buildSections({ pageCount: 2 });
      wrapper = render({ questionnaire });
      const button = wrapper.find("[data-test='btn-move']").prop("disabled");

      expect(button).toBeFalsy();
    });
  });
});
