import React from "react";
import { shallow } from "enzyme";

import MovePageQuery from "./MovePageModal/MovePageQuery";
import { PageHeader } from "./PageHeader";
import {
  buildQuestionnaire,
  buildSections,
} from "tests/utils/createMockQuestionnaire";

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
      const moveWrapper = shallow(
        wrapper.find(MovePageQuery).prop("children")({
          data: { questionnaire },
        })
      );

      expect(moveWrapper.prop("isOpen")).toEqual(true);
    });

    it("should call handler when confirmed", () => {
      const moveWrapper = shallow(
        wrapper.find(MovePageQuery).prop("children")({
          data: { questionnaire },
        })
      );
      moveWrapper.simulate("movePage");
      expect(mockHandlers.onMovePage).toHaveBeenCalled();
    });

    it("should call handler when closed", () => {
      const moveWrapper = shallow(
        wrapper.find(MovePageQuery).prop("children")({
          data: { questionnaire },
        })
      );
      moveWrapper.simulate("close");
      expect(wrapper.state("showMovePageDialog")).toEqual(false);
    });

    it("should disable move when only one question", () => {
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
