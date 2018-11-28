import React from "react";
import { shallow } from "enzyme";

import { UnwrappedQuestionnaireDesignPage as QuestionnaireDesignPage } from "components/QuestionnaireDesignPage";

describe("QuestionnaireDesignPage", () => {
  let mockHandlers;
  let wrapper;
  let match;

  const answer = {
    id: "1",
    label: "",
    options: [{ id: "1" }]
  };

  const page = {
    id: "1",
    description: "",
    guidance: "",
    title: "",
    type: "General",
    position: 0,
    answers: [answer]
  };

  const section = {
    id: "2",
    title: "",
    pages: [page]
  };

  const questionnaire = {
    id: "3",
    title: "hello world",
    sections: [section]
  };

  beforeEach(() => {
    mockHandlers = {
      onUpdateSection: jest.fn(),
      onAddPage: jest.fn(),
      onUpdatePage: jest.fn(),
      onDeletePage: jest.fn(),
      onDeleteSection: jest.fn(),
      onCreateQuestionConfirmation: jest.fn()
    };

    match = {
      params: {
        questionnaireId: questionnaire.id,
        sectionId: section.id,
        pageId: page.id
      }
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

  describe("onAddPage", () => {
    it("should add new page below current page", () => {
      wrapper.find(`[data-test="side-nav"]`).simulate("addPage");

      expect(mockHandlers.onAddPage).toHaveBeenCalledWith(
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
              pages: []
            }
          ]
        }
      });

      wrapper.find(`[data-test="side-nav"]`).simulate("addPage");

      expect(mockHandlers.onAddPage).toHaveBeenCalledWith(section.id, 1);
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
        "1"
      );
    });

    it("should disable adding question page when the page already has one", () => {
      questionnaire.sections[0].pages[0].confirmation = {
        id: 1
      };
      wrapper.setProps({ data: { questionnaire } });
      expect(wrapper.find(`[data-test="side-nav"]`).props()).toMatchObject({
        canAddQuestionConfirmation: false
      });
    });

    it("should disable adding question confirmation when not on a question page", () => {
      match.params.pageId = undefined;
      wrapper.setProps({ match });
      expect(wrapper.find(`[data-test="side-nav"]`).props()).toMatchObject({
        canAddQuestionConfirmation: false
      });
    });

    it("should disable adding question confirmation when the page cannot be found", () => {
      match.params.pageId = "hello";
      wrapper.setProps({ match });
      expect(wrapper.find(`[data-test="side-nav"]`).props()).toMatchObject({
        canAddQuestionConfirmation: false
      });
    });

    it("should disable adding question confirmation whilst loading", () => {
      wrapper.setProps({ data: {} });
      expect(wrapper.find(`[data-test="side-nav"]`).props()).toMatchObject({
        canAddQuestionConfirmation: false
      });
    });
  });
});
