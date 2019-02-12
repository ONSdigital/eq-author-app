const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { last, get } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  queryQuestionPage,
  updateQuestionPage,
} = require("../../tests/utils/questionnaireBuilder/page");

const { NUMBER, DATE } = require("../../constants/answerTypes");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../constants/logicalDestinations");

describe("page", () => {
  let questionnaire, section, page;
  let config = {
    metadata: [{}],
    sections: [
      {
        pages: [
          {
            title: "title-1",
            alias: "alias-1",
            description: "description-1",
            guidance: "guidance-1",
            position: 0,
            definitionLabel: "definitionLabel-1",
            definitionContent: "definitionContent-1",
            additionalInfoLabel: "additionalInfoLabel-1",
            additionalInfoContent: "additionalInfoContent-1",
            answers: [
              {
                type: NUMBER,
              },
            ],
          },
          {
            title: "title-2",
            answers: [
              {
                type: DATE,
              },
            ],
            confirmation: {
              title: "question-confirmation-2",
            },
          },
        ],
      },
    ],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
    page = last(section.pages);
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a page", () => {
      expect(page).toEqual(
        expect.objectContaining(
          filter(
            gql`
              {
                title
                description
                sectionId
                position
              }
            `,
            last(last(config.sections).pages)
          )
        )
      );
    });
  });

  describe("mutate", () => {
    let updatedPage;
    let update;
    beforeEach(async () => {
      update = {
        id: page.id,
        title: "title-updated",
        alias: "alias-updated",
        description: "description-updated",
        guidance: "guidance-updated",
        definitionLabel: "definitionLabel-updated",
        definitionContent: "definitionContent-updated",
        additionalInfoLabel: "additionalInfoLabel-updated",
        additionalInfoContent: "additionalInfoContent-updated",
      };
      updatedPage = await updateQuestionPage(questionnaire, update);
    });

    it("should mutate a section", () => {
      expect(updatedPage).toEqual(expect.objectContaining(update));
    });
  });

  describe("query", () => {
    let queriedPage;

    beforeEach(async () => {
      queriedPage = await queryQuestionPage(questionnaire, page.id);
    });

    it("should resolve page fields", () => {
      expect(queriedPage).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        alias: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        guidance: expect.any(String),
        pageType: expect.any(String),
        answers: expect.any(Array),
        section: expect.any(Object),
        position: expect.any(Number),
        definitionLabel: expect.any(String),
        definitionContent: expect.any(String),
        additionalInfoLabel: expect.any(String),
        additionalInfoContent: expect.any(String),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
        availableRoutingAnswers: expect.any(Array),
        availableRoutingDestinations: expect.any(Object),
        confirmation: expect.any(Object) || null,
        routing: expect.any(Object) || null,
      });
    });

    it("should resolve pageType", () => {
      expect(queriedPage.pageType).toEqual("QuestionPage");
    });

    it("should resolve answers", () => {
      expect(last(queriedPage.answers).id).toEqual(last(page.answers).id);
    });

    it("should resolve section", () => {
      expect(queriedPage.section.id).toEqual(section.id);
    });

    it("should resolve availablePipingAnswers", () => {
      expect(last(queriedPage.availablePipingAnswers).id).toEqual(
        get(questionnaire, "sections[1].pages[1].answers[0].id")
      );
    });

    it("should resolve availablePipingMetadata", () => {
      expect(last(queriedPage.availablePipingMetadata).id).toEqual(
        last(questionnaire.metadata).id
      );
    });

    it("should resolve availableRoutingAnswers", () => {
      expect(last(queriedPage.availableRoutingAnswers).id).toEqual(
        get(questionnaire, "sections[1].pages[1].answers[0].id")
      );
    });

    it("should resolve availableRoutingDestinations", () => {
      expect(queriedPage.availableRoutingDestinations).toEqual({
        logicalDestinations: [
          {
            id: NEXT_PAGE,
          },
          {
            id: END_OF_QUESTIONNAIRE,
          },
        ],
      });
    });

    it("should resolve confirmation", () => {
      expect(queriedPage.confirmation.id).toEqual(page.confirmation.id);
    });

    it("should resolve routing", () => {
      //@todo
    });
  });
});
