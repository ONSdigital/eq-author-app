import React from "react";
import { Query, Subscription } from "react-apollo";
import { shallow, mount } from "enzyme";
import {
  buildQuestionnaire,
  buildAnswers,
} from "tests/utils/createMockQuestionnaire";
import { flatMap } from "lodash";
import {
  organiseAnswers,
  flattenAnswers,
  duplicatesAnswers,
} from "utils/getAllAnswersFlatMap";

import {
  SECTION,
  PAGE,
  QUESTION_CONFIRMATION,
  INTRODUCTION,
  FOLDER,
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
  getSections,
  getFolders,
  getPages,
  getFolderById,
  getFolderByPageId,
  getSectionByFolderId,
  getSectionByPageId,
  getPageByConfirmationId,
} from "./";

describe("QuestionnaireDesignPage", () => {
  let mockHandlers;
  let wrapper;
  let match;
  let confirmation,
    page,
    folder,
    section,
    questionnaire,
    validations,
    duplicateTest;

  beforeEach(() => {
    questionnaire = buildQuestionnaire();
    section = questionnaire.sections[0];
    folder = questionnaire.sections[0].folders[0];
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
      onAddFolder: jest.fn(),
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

    it("should disable adding folder page when on introduction page", () => {
      expect(wrapper.find(NavigationSidebar).prop("canAddFolder")).toEqual(
        false
      );
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

  describe("onAddFolder", () => {
    it("Should be able to add a folder at the start when on a section", () => {
      wrapper.setProps({
        match: {
          params: {
            questionnaireId: questionnaire.id,
            entityName: SECTION,
            entityId: section.id,
          },
        },
      });

      wrapper.find(NavigationSidebar).simulate("addFolder");

      expect(mockHandlers.onAddFolder).toHaveBeenCalledWith(section.id, 0);
    });

    it("Should be able to add a folder below the current folder", () => {
      wrapper.setProps({
        match: {
          params: {
            questionnaireId: questionnaire.id,
            entityName: FOLDER,
            entityId: folder.id,
          },
        },
      });

      wrapper.find(NavigationSidebar).simulate("addFolder");

      expect(mockHandlers.onAddFolder).toHaveBeenCalledWith(
        section.id,
        folder.position + 1
      );
    });

    it("Should be able to add a folder below the current page", () => {
      wrapper.find(NavigationSidebar).simulate("addFolder");

      expect(mockHandlers.onAddFolder).toHaveBeenCalledWith(
        section.id,
        page.position + 1
      );
    });

    it("Should be able to add a folder below the current confirmation page", () => {
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

      wrapper.find(NavigationSidebar).simulate("addFolder");

      expect(mockHandlers.onAddFolder).toHaveBeenCalledWith(
        section.id,
        page.position + 1
      );
    });

    it("Throws when it doesn't recognise the current entity", () => {
      wrapper.setProps({
        match: {
          params: {
            questionnaireId: questionnaire.id,
            entityName: "BeBe Zahara Benet",
            entityId: folder.id,
          },
        },
      });

      expect(() =>
        wrapper.find(NavigationSidebar).simulate("addFolder")
      ).toThrow();
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

      const getTitle = wrapper
        .findWhere((n) => n.name() === "GetContext")
        .props().title;

      expect(getTitle()).toEqual("");
    });

    it("should display questionnaire title if no longer loading", () => {
      const getTitle = wrapper
        .findWhere((n) => n.name() === "GetContext")
        .props().title;

      expect(getTitle()).toEqual(questionnaire.title);
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

  describe("Helpers", () => {
    it("Can get all sections in a questionnaire", () => {
      expect(getSections(questionnaire)).toMatchObject(questionnaire.sections);
    });

    it("Can get all folders in a questionnaire", () => {
      const folders = flatMap(questionnaire.sections, ({ folders }) => folders);

      expect(getFolders(questionnaire)).toMatchObject(folders);
    });

    it("Can get all pages in a questionnaire", () => {
      const folders = flatMap(questionnaire.sections, ({ folders }) => folders);
      const pages = flatMap(folders, ({ pages }) => pages);

      expect(getPages(questionnaire)).toMatchObject(pages);
    });

    it("Can get a folder by it's ID", () => {
      const folders = flatMap(questionnaire.sections, ({ folders }) => folders);
      const firstFolder = folders[0];

      expect(getFolderById(questionnaire, firstFolder.id)).toMatchObject(
        firstFolder
      );
    });

    it("Can get a folder by a page ID", () => {
      const folders = flatMap(questionnaire.sections, ({ folders }) => folders);

      const firstFolder = folders[0];
      const firstPage = firstFolder.pages[0];

      expect(getFolderByPageId(questionnaire, firstPage.id)).toMatchObject(
        firstFolder
      );
    });

    it("Can get a section by a folder ID", () => {
      const sections = questionnaire.sections;
      const firstSection = sections[0];
      const folders = flatMap(sections, ({ folders }) => folders);
      const firstFolder = folders[0];

      expect(getSectionByFolderId(questionnaire, firstFolder.id)).toMatchObject(
        firstSection
      );
    });

    it("Can get a section by a page ID", () => {
      const sections = questionnaire.sections;
      const firstSection = sections[0];
      const folders = flatMap(sections, ({ folders }) => folders);
      const firstFolder = folders[0];
      const firstPage = firstFolder.pages[0];

      expect(getSectionByPageId(questionnaire, firstPage.id)).toMatchObject(
        firstSection
      );
    });

    it("Can get a page by a confirmation page ID", () => {
      page.confirmation = confirmation;

      const sections = questionnaire.sections;
      const folders = flatMap(sections, ({ folders }) => folders);
      const firstFolder = folders[0];
      const firstPage = firstFolder.pages[0];

      expect(
        getPageByConfirmationId(questionnaire, confirmation.id)
      ).toMatchObject(firstPage);
    });
  });
  describe("getAllAnswersFlatMap", () => {
    const checkboxAnswers = (refined) => [
      {
        id: "checkbox-answer",
        label: "",
        secondaryLabel: null,
        type: "Checkbox",
        properties: {
          required: false,
        },
        qCode: "",
        length: 2,
        options: [
          {
            id: "option-1",
            label: "checkbox 1",
            qCode: null,
            __typename: "Option",
            ...(refined && { option: true, type: "CheckboxOption" }),
          },
          {
            id: "option-2",
            label: "checkbox 2",
            qCode: null,
            __typename: "Option",
            ...(refined && { option: true, type: "CheckboxOption" }),
          },
        ],
        mutuallyExclusiveOption: {
          id: "mutually-exclusive-option",
          label: "mutually exclusive option",
          qCode: "1",
          __typename: "Option",
          ...(refined && { option: true, type: "MutuallyExclusiveOption" }),
        },
        ...(refined && { type: "Checkbox" }),
        __typename: "MultipleChoiceAnswer",
      },
    ];

    const checkboxPage = () => ({
      id: "checkbox-page",
      title: "<p>Checkbox page</p>",
      position: 0,
      displayName: "Checkbox page",
      pageType: "QuestionPage",
      alias: "asda",
      answers: checkboxAnswers(),
    });

    const refinedCheckbox = checkboxAnswers(true)[0];

    const answers = [
      {
        title: "Page 1.1.1",
        alias: "1.1.1",
        answers: buildAnswers({ answerCount: 1 }),
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        answers: [
          ...checkboxAnswers(),
          ...refinedCheckbox.options,
          refinedCheckbox.mutuallyExclusiveOption,
        ],
      },
    ];

    const flatAnswers = [
      {
        title: "Page 1.1.1",
        alias: "1.1.1",
        ...buildAnswers({ answerCount: 1 })[0],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        ...checkboxAnswers()[0],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.options[0],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.options[1],
      },
      {
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.mutuallyExclusiveOption,
      },
    ];

    duplicateTest = {
      1: 2,
    };

    it("it should organiseAnswers into a list", () => {
      const questionnaire = buildQuestionnaire({
        pageCount: 2,
        answerCount: 1,
      });
      questionnaire.sections[0].folders[0].pages[1] = checkboxPage();
      const answersListTest = organiseAnswers(questionnaire.sections);
      expect(answersListTest.answers).toEqual(answers);
    });

    it("it should flatten answers", () => {
      const flat = flattenAnswers(answers);
      const mutuallyExclusiveOption = flat.find(
        (x) => x.type === "MutuallyExclusiveOption"
      );
      expect(flat).toEqual(flatAnswers);
      expect(mutuallyExclusiveOption).toBeTruthy();
    });

    it("it should list duplicate answers", () => {
      flatAnswers.push({
        title: "<p>Checkbox page</p>",
        alias: "asda",
        nested: true,
        ...refinedCheckbox.mutuallyExclusiveOption,
      });
      const duplicates = duplicatesAnswers(flatAnswers);
      expect(duplicates).toEqual(duplicateTest);
    });
  });
});
