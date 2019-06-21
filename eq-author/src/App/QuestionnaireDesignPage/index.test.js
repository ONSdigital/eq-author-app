import React from "react";
import { shallow } from "enzyme";

import {
  SECTION,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
} from "constants/entities";
import {
  ERR_PAGE_NOT_FOUND,
  ERR_UNAUTHORIZED_QUESTIONNAIRE,
} from "constants/error-codes";

import NavigationSidebar from "./NavigationSidebar";

import {
  UnwrappedQuestionnaireDesignPage as QuestionnaireDesignPage,
  throwIfUnauthorized,
} from "./";

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
      pageType: "QuestionPage",
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
      displayName: "my displayName",
    };

    mockHandlers = {
      onUpdateSection: jest.fn(),
      onAddQuestionPage: jest.fn(),
      onAddSection: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePage: jest.fn(),
      onDeleteSection: jest.fn(),
      onCreateQuestionConfirmation: jest.fn(),
      onAddCalculatedSummaryPage: jest.fn(),
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

  it("should redirect to the introduction if it has one", () => {
    wrapper.setProps({
      data: {
        questionnaire: {
          ...questionnaire,
          introduction: {
            id: "1",
          },
        },
      },
    });
    expect(wrapper.instance().renderRedirect()).toMatchSnapshot();
  });

  describe("onIntroductionPage", () => {
    beforeEach(() => {
      wrapper.setProps({
        data: {
          questionnaire: {
            ...questionnaire,
            introduction: {
              id: "1",
            },
          },
        },
        match: {
          params: {
            questionnaireId: questionnaire.id,
            entityName: INTRODUCTION,
          },
        },
      });
    });

    it("should disable adding question page when on introduction page", () => {
      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionPage")
      ).toEqual(false);
    });

    it("should disable adding confirmation queation when on introduction page", () => {
      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionConfirmation")
      ).toEqual(false);
    });

    it("should disable adding calculated summary when on introduction page", () => {
      expect(
        wrapper.find(NavigationSidebar).prop("canAddCalculatedSummaryPage")
      ).toEqual(false);
    });
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

  describe("onAddCalculatedSummaryPage", () => {
    it("should add new page below current page", () => {
      wrapper.find(NavigationSidebar).simulate("addCalculatedSummaryPage");

      expect(mockHandlers.onAddCalculatedSummaryPage).toHaveBeenCalledWith(
        section.id,
        page.position + 1
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

      wrapper.find(NavigationSidebar).simulate("addCalculatedSummaryPage");

      expect(mockHandlers.onAddCalculatedSummaryPage).toHaveBeenCalledWith(
        section.id,
        0
      );
    });
  });

  describe("getTitle", () => {
    it("should display existing title if loading", () => {
      wrapper.setProps({ loading: true });
      expect(wrapper.instance().getTitle()).toEqual("");
    });

    it("should display questionnaire title if no longer loading", () => {
      expect(wrapper.instance().getTitle()).toEqual(questionnaire.title);
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
      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionConfirmation")
      ).toEqual(false);
    });

    it("should disable adding question confirmation when not on a page", () => {
      match.params.entityName = "foo";
      wrapper.setProps({ match });
      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionConfirmation")
      ).toEqual(false);
    });

    it("should disable adding question confirmation when not on a question page", () => {
      questionnaire.sections[0].pages[0] = {
        id: "1",
        title: "",
        pageType: "NotQuestionPage",
        position: 0,
      };
      wrapper.setProps({ data: { questionnaire } });
      expect(wrapper.find(NavigationSidebar).props()).toMatchObject({
        canAddQuestionConfirmation: false,
      });
    });

    it("should disable adding question confirmation when the page cannot be found", () => {
      match.params.entityId = "hello";
      wrapper.setProps({ match });
      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionConfirmation")
      ).toEqual(false);
    });

    it("should disable adding question confirmation, question page & calculated summary whilst loading", () => {
      wrapper.setProps({
        loading: true,
        data: {},
      });
      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionPage")
      ).toEqual(false);

      expect(
        wrapper.find(NavigationSidebar).prop("canAddCalculatedSummaryPage")
      ).toEqual(false);

      expect(
        wrapper.find(NavigationSidebar).prop("canAddQuestionConfirmation")
      ).toEqual(false);
    });

    it("should trigger PAGE_NOT_FOUND error if no question data available after loading finished", () => {
      const throwWrapper = () => {
        wrapper.setProps({
          loading: false,
          data: {},
        });
      };

      expect(throwWrapper).toThrow(new Error(ERR_PAGE_NOT_FOUND));
    });

    it("should throw ERR_UNAUTHORIZED_QUESTIONNAIRE if access denied", () => {
      const innerProps = {
        error: {
          networkError: {
            bodyText: ERR_UNAUTHORIZED_QUESTIONNAIRE,
          },
        },
      };

      expect(() => throwIfUnauthorized(innerProps)).toThrow(
        new Error(ERR_UNAUTHORIZED_QUESTIONNAIRE)
      );
    });
    it("should render questionnaire design page if access granted", () => {
      const innerProps = {};
      expect(
        shallow(
          throwIfUnauthorized(innerProps, {
            ...mockHandlers,
            match: match,
            data: { questionnaire },
            loading: false,
          })
        )
      ).toMatchSnapshot();
    });
  });
});
