import React from "react";
import { Query, Subscription } from "react-apollo";
import { shallow, mount } from "enzyme";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";
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
  let confirmation,
    page,
    section,
    questionnaire,
    validations,
    sectionsForFlatAnswers,
    answerList,
    flatAnswersTest,
    duplicateTest;

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

  describe("getAllAnswersFlatMap", () => {
    sectionsForFlatAnswers = [
      {
        id: "4b0280df-c345-4c20-ada2-806105de87d6",
        title: "<p>sect1</p>",
        displayName: "sect1",
        questionnaire: {
          id: "bbb6f10d-4f95-4f96-8c66-1e777653dd4f",
          __typename: "Questionnaire",
        },
        folders: [
          {
            id: "14f7b1ef-b26c-4f6f-bdb6-37eff316b4d9",
            pages: [
              {
                id: "ff7e458d-028f-471c-a95d-2d3161da133e",
                title: "<p>Q1</p>",
                position: 0,
                displayName: "Q1",
                pageType: "QuestionPage",
                alias: null,
                confirmation: null,
                answers: [
                  {
                    id: "ID-Q1-1",
                    label: "num1",
                    secondaryLabel: "sec label1",
                    type: "Number",
                    properties: {
                      required: false,
                      decimals: 0,
                    },
                    length: 1,
                    qCode: "Duplicate",
                    secondaryQCode: "sec QCode1",
                    __typename: "BasicAnswer",
                    title: "<p>Q1</p>",
                  },
                ],
                __typename: "QuestionPage",
              },
            ],
            __typename: "Folder",
          },
          {
            id: "14f7b1ef-b26c-4f6f-bdb6-37eff316b4d9",
            pages: [
              {
                id: "ff7e458d-028f-471c-a95d-2d3161da133e",
                title: "<p>Q2</p>",
                position: 0,
                displayName: "Q2",
                pageType: "QuestionPage",
                alias: null,
                confirmation: null,
                answers: [
                  {
                    id: "ID-Q2-1",
                    label: "num2",
                    secondaryLabel: null,
                    type: "Number",
                    properties: {
                      required: false,
                      decimals: 0,
                    },
                    qCode: "Duplicate",
                    secondaryQCode: null,
                    __typename: "BasicAnswer",
                    length: 1,
                    title: "<p>Q2</p>",
                  },
                ],
                __typename: "QuestionPage",
              },
            ],
            __typename: "Folder",
          },
          {
            id: "600bdaed-eb6f-4541-8e8f-d9895afaba57",
            pages: [
              {
                id: "360002a6-eedb-4fa8-9d5c-51cdd6a78a18",
                title: "<p>q2 - chkbox</p>",
                position: 0,
                displayName: "q2 - chkbox",
                pageType: "QuestionPage",
                alias: null,
                confirmation: null,
                answers: [
                  {
                    id: "57f4d945-cd90-4596-8ec7-b7a1ef035c16",
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
                        id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
                        label: "checkbox 1",
                        qCode: null,
                        __typename: "Option",
                      },
                      {
                        id: "1e3eb896-be3d-4048-be69-269e125f5628",
                        label: "checkbox 2",
                        qCode: null,
                        __typename: "Option",
                      },
                    ],
                    mutuallyExclusiveOption: null,
                    __typename: "MultipleChoiceAnswer",
                  },
                ],
                __typename: "QuestionPage",
              },
            ],
            __typename: "Folder",
          },
        ],
        __typename: "Section",
      },
    ];

    answerList = [
      {
        title: "<p>Q1</p>",
        alias: null,
        answers: [
          {
            id: "ID-Q1-1",
            label: "num1",
            secondaryLabel: "sec label1",
            type: "Number",
            properties: {
              required: false,
              decimals: 0,
            },
            length: 1,
            qCode: "Duplicate",
            secondaryQCode: "sec QCode1",
            __typename: "BasicAnswer",
            title: "<p>Q1</p>",
          },
          {
            id: "ID-Q1-1",
            label: "sec label1",
            qCode: "sec QCode1",
            type: "Number",
            secondary: true,
          },
        ],
      },
      {
        title: "<p>Q2</p>",
        alias: null,
        answers: [
          {
            id: "ID-Q2-1",
            label: "num2",
            secondaryLabel: null,
            type: "Number",
            properties: {
              required: false,
              decimals: 0,
            },
            qCode: "Duplicate",
            secondaryQCode: null,
            __typename: "BasicAnswer",
            length: 1,
            title: "<p>Q2</p>",
          },
        ],
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        answers: [
          {
            id: "57f4d945-cd90-4596-8ec7-b7a1ef035c16",
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
                id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
                label: "checkbox 1",
                qCode: null,
                __typename: "Option",
              },
              {
                id: "1e3eb896-be3d-4048-be69-269e125f5628",
                label: "checkbox 2",
                qCode: null,
                __typename: "Option",
              },
            ],
            mutuallyExclusiveOption: null,
            __typename: "MultipleChoiceAnswer",
          },
          {
            id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
            label: "checkbox 1",
            qCode: null,
            __typename: "Option",
            type: "CheckboxOption",
            option: true,
          },
          {
            id: "1e3eb896-be3d-4048-be69-269e125f5628",
            label: "checkbox 2",
            qCode: null,
            __typename: "Option",
            type: "CheckboxOption",
            option: true,
          },
        ],
      },
    ];

    flatAnswersTest = [
      {
        title: "<p>Q1</p>",
        alias: null,
        id: "ID-Q1-1",
        label: "num1",
        secondaryLabel: "sec label1",
        type: "Number",
        properties: {
          required: false,
          decimals: 0,
        },
        length: 1,
        qCode: "Duplicate",
        secondaryQCode: "sec QCode1",
        __typename: "BasicAnswer",
      },
      {
        title: "<p>Q1</p>",
        alias: null,
        nested: true,
        id: "ID-Q1-1",
        label: "sec label1",
        qCode: "sec QCode1",
        type: "Number",
        secondary: true,
      },
      {
        title: "<p>Q2</p>",
        alias: null,
        id: "ID-Q2-1",
        label: "num2",
        secondaryLabel: null,
        type: "Number",
        properties: {
          required: false,
          decimals: 0,
        },
        qCode: "Duplicate",
        secondaryQCode: null,
        __typename: "BasicAnswer",
        length: 1,
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        id: "57f4d945-cd90-4596-8ec7-b7a1ef035c16",
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
            id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
            label: "checkbox 1",
            qCode: null,
            __typename: "Option",
          },
          {
            id: "1e3eb896-be3d-4048-be69-269e125f5628",
            label: "checkbox 2",
            qCode: null,
            __typename: "Option",
          },
        ],
        mutuallyExclusiveOption: null,
        __typename: "MultipleChoiceAnswer",
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        nested: true,
        id: "7ded7fad-2e4d-4c74-815e-395993ae35c0",
        label: "checkbox 1",
        qCode: null,
        __typename: "Option",
        type: "CheckboxOption",
        option: true,
      },
      {
        title: "<p>q2 - chkbox</p>",
        alias: null,
        nested: true,
        id: "1e3eb896-be3d-4048-be69-269e125f5628",
        label: "checkbox 2",
        qCode: null,
        __typename: "Option",
        type: "CheckboxOption",
        option: true,
      },
    ];

    duplicateTest = {
      Duplicate: 2,
      "sec QCode1": 1,
      "": 1,
      null: 1,
    };

    it("it should organiseAnswers into a list", () => {
      const answersListTest = organiseAnswers(sectionsForFlatAnswers);
      expect(answersListTest.answers).toEqual(answerList);
    });

    it("it should flatten answers", () => {
      const flattenedAnswers = flattenAnswers(answerList);
      expect(flattenedAnswers).toEqual(flatAnswersTest);
    });

    it("it should list duplicate answers", () => {
      const duplicates = duplicatesAnswers(flatAnswersTest);
      expect(duplicates).toEqual(duplicateTest);
    });
  });
});
