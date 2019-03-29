import React from "react";
import { shallow } from "enzyme";

import { SECTION, PAGE, QUESTION_CONFIRMATION } from "constants/entities";
import { ERR_PAGE_NOT_FOUND } from "constants/error-codes";

import NavigationSidebar from "./NavigationSidebar";

import { UnwrappedQuestionnaireDesignPage as QuestionnaireDesignPage } from ".";

describe("QuestionnaireDesignPage", () => {
  let mockHandlers;
  let wrapper;
  let match;
  let answer, confirmation, page, section, questionnaire;

  beforeEach(() => {
    answer = {
      id: "1",
      label: "",
      options: [{ id: "1" }],
    };

    confirmation = {
      id: "4",
      title: "Confirmation",
    };

    page = {
      id: "1",
      description: "",
      guidance: "",
      title: "",
      type: "General",
      position: 0,
      answers: [answer],
    };

    section = {
      id: "2",
      title: "",
      pages: [page],
    };

    questionnaire = {
      id: "3",
      title: "hello world",
      sections: [section],
    };

    mockHandlers = {
      onUpdateSection: jest.fn(),
      onAddQuestionPage: jest.fn(),
      onAddSection: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePage: jest.fn(),
      onDeleteSection: jest.fn(),
      onCreateQuestionConfirmation: jest.fn(),
    };

    match = {
      params: {
        questionnaireId: questionnaire.id,
        entityName: PAGE,
        entityId: page.id,
      },
    };

    wrapper = shallow(
      <QuestionnaireDesignPage
        {...mockHandlers}
        match={match}
        data={{ questionnaire }}
        loading={false}
      />
    );
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render spinner while loading", () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.instance().renderRedirect()).toMatchSnapshot();
  });

  it("should render redirect when finished loading", () => {
    expect(wrapper.instance().renderRedirect()).toMatchSnapshot();
  });

  describe("onAddQuestionPage", () => {
    it("should add new page below current page", () => {
      wrapper.find(NavigationSidebar).simulate("addQuestionPage");

      expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
        section.id,
        page.position + 1
      );
    });

    it("should add page at start of section if page not found", () => {
      wrapper.setProps({
        questionnaire: {
          ...questionnaire,
          sections: [
            {
              ...section,
              pages: [],
            },
          ],
        },
      });

      wrapper.find(NavigationSidebar).simulate("addQuestionPage");

      expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
        section.id,
        1
      );
    });

    it("should be able to add a page at the start when on a section", () => {
      wrapper.setProps({
        match: {
          params: {
            questionnaireId: questionnaire.id,
            entityName: SECTION,
            entityId: section.id,
          },
        },
      });

      wrapper.find(NavigationSidebar).simulate("addQuestionPage");

      expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
        section.id,
        0
      );
    });

    it("should be able to add a page after the confirmation when on a confirmation page", () => {
      page.confirmation = confirmation;
      wrapper.setProps({
        match: {
          params: {
            questionnaireId: questionnaire.id,
            entityName: QUESTION_CONFIRMATION,
            entityId: confirmation.id,
          },
        },
      });
      wrapper.find(NavigationSidebar).simulate("addQuestionPage");

      expect(mockHandlers.onAddQuestionPage).toHaveBeenCalledWith(
        section.id,
        page.position + 1
      );
    });
  });

  describe("getTitle", () => {
    it("should display existing title if loading", () => {
      wrapper.setProps({ loading: true });
      expect(wrapper.instance().getTitle("foo")).toMatchSnapshot();
    });

    it("should display questionnaire title if no longer loading", () => {
      expect(wrapper.instance().getTitle("foo")).toMatchSnapshot();
    });
  });

  describe("Adding question confirmation", () => {
    it("should call create a question confirmation when addQuestionPage is called", () => {
      wrapper
        .find(`[data-test="side-nav"]`)
        .simulate("addQuestionConfirmation");
      expect(mockHandlers.onCreateQuestionConfirmation).toHaveBeenCalledWith(
        page.id
      );
    });

    it("should disable adding question page when the page already has one", () => {
      questionnaire.sections[0].pages[0].confirmation = {
        id: 1,
      };
      wrapper.setProps({ data: { questionnaire } });
      expect(wrapper.find(NavigationSidebar).props()).toMatchObject({
        canAddQuestionConfirmation: false,
      });
    });

    it("should disable adding question confirmation when not on a question page", () => {
      match.params.entityName = "foo";
      wrapper.setProps({ match });
      expect(wrapper.find(NavigationSidebar).props()).toMatchObject({
        canAddQuestionConfirmation: false,
      });
    });

    it("should disable adding question confirmation when the page cannot be found", () => {
      match.params.entityId = "hello";
      wrapper.setProps({ match });
      expect(wrapper.find(NavigationSidebar).props()).toMatchObject({
        canAddQuestionConfirmation: false,
      });
    });

    it("should disable adding question confirmation whilst loading", () => {
      wrapper.setProps({
        loading: true,
        data: {} 
      });
      expect(wrapper.find(NavigationSidebar).props()).toMatchObject({
        canAddQuestionConfirmation: false,
      });
    });

    it("should trigger PAGE_NOT_FOUND error if no question data available after loading finished", () => {
      
      const throwWrapper = () => {
        wrapper.setProps({
          loading: false,
          data: {}
        });  
      }

      expect(throwWrapper).toThrow( new Error(ERR_PAGE_NOT_FOUND));

    });
  });
});
