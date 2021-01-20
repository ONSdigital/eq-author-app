import React from "react";
import { Query, Subscription } from "react-apollo";
import { shallow, mount } from "enzyme";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

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
  withAuthCheck,
  withValidations,
  withQuestionnaire,
} from "./";

describe("QuestionnaireDesignPage", () => {
  let mockHandlers;
  let wrapper;
  let match;
  let confirmation, page, section, questionnaire, validations;

  beforeEach(() => {
    questionnaire = buildQuestionnaire();
    section = questionnaire.sections[0];
    page = questionnaire.sections[0].folders[0].pages[0];

    confirmation = {
      id: "4",
      title: "Confirmation",
    };

    validations = {
      id: "3",
      errorCount: 0,
      pages: [],
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
        questionnaire={questionnaire}
        validations={validations}
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
      questionnaire: {
        ...questionnaire,
        introduction: {
          id: "1",
        },
      },
    });
    expect(wrapper.instance().renderRedirect()).toMatchSnapshot();
  });

  it("should throw an error for invalid entity types", () => {
    wrapper.setProps({
      match: {
        params: {
          questionnaireId: questionnaire.id,
          entityName: "invalid",
        },
      },
    });

    expect(() =>
      wrapper.find(NavigationSidebar).simulate("addQuestionPage")
    ).toThrow();
  });

  describe("onIntroductionPage", () => {
    beforeEach(() => {
      wrapper.setProps({
        questionnaire: {
          ...questionnaire,
          introduction: {
            id: "1",
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

    it("should disable adding confirmation question when on introduction page", () => {
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

    it("should disable adding confirmation page when the question page already has one", () => {
      questionnaire.sections[0].folders[0].pages[0].confirmation = {
        id: 1,
      };
      wrapper.setProps({ questionnaire });
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
      questionnaire.sections[0].folders[0].pages[0] = {
        id: "1",
        title: "",
        pageType: "NotQuestionPage",
        position: 0,
      };
      wrapper.setProps({ questionnaire });
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
        questionnaire: null,
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
          questionnaire: null,
        });
      };

      expect(throwWrapper).toThrow(new Error(ERR_PAGE_NOT_FOUND));
    });

    describe("withAuthCheck", () => {
      it("should throw ERR_UNAUTHORIZED_QUESTIONNAIRE if access denied", () => {
        const props = {
          error: {
            networkError: {
              bodyText: ERR_UNAUTHORIZED_QUESTIONNAIRE,
            },
          },
        };

        const Component = withAuthCheck(() => <h1>hello</h1>);

        expect(() => shallow(<Component {...props} />)).toThrow(
          new Error(ERR_UNAUTHORIZED_QUESTIONNAIRE)
        );
      });
      it("should render questionnaire design page if access granted", () => {
        const Component = withAuthCheck(() => <h1>hello</h1>);
        const wrapper = mount(<Component />);
        expect(wrapper.find("h1")).toHaveLength(1);
      });
    });

    describe("withValidations", () => {
      let match;
      beforeEach(() => {
        match = {
          params: {
            questionnaireId: "qId",
          },
        };
      });
      it("should render the component with the validations from the subscription", () => {
        const Component = withValidations(() => <hr />);
        const renderFunc = shallow(<Component match={match} />)
          .find(Subscription)
          .renderProp("children");
        const wrapper = renderFunc({
          data: { validationUpdated: "validations" },
        });
        expect(wrapper).toMatchSnapshot();
      });
      it("should call the subscription with the questionnaire id", () => {
        const Component = withValidations(() => <hr />);
        const wrapper = shallow(<Component match={match} />);
        expect(wrapper).toMatchSnapshot();
      });
    });

    describe("withQuestionnaire", () => {
      let match;
      beforeEach(() => {
        match = {
          params: {
            questionnaireId: "qId",
          },
        };
      });
      it("should render the component with the questionnaire", () => {
        const Component = withQuestionnaire(() => <hr />);
        const renderFunc = shallow(<Component match={match} />)
          .find(Query)
          .renderProp("children");
        const wrapper = renderFunc({
          loading: false,
          error: null,
          data: { questionnaire: "validations" },
        });
        expect(wrapper).toMatchSnapshot();
      });
      it("should call the query with the questionnaire id", () => {
        const Component = withQuestionnaire(() => <hr />);
        const wrapper = shallow(<Component match={match} />);
        expect(wrapper).toMatchSnapshot();
      });
    });
  });
});
