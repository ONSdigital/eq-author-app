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
  createQuestionPage,
  queryQuestionPage,
  updateQuestionPage,
  deleteQuestionPage,
  moveQuestionPage,
} = require("../../tests/utils/questionnaireBuilder/page");

const { NUMBER, DATE } = require("../../constants/answerTypes");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../constants/logicalDestinations");

const getFirstPage = questionnaire => questionnaire.sections[0].pages[0];

describe("page", () => {
  let questionnaire;
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

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create a page", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [{}],
      });
      const section = questionnaire.sections[0];

      const createdPage = await createQuestionPage(questionnaire, {
        title: "Title",
        description: "Description",
        sectionId: section.id,
      });
      expect(createdPage).toMatchObject({
        title: "Title",
        description: "Description",
        position: 0,
      });
    });
  });

  describe("mutate", () => {
    it("should mutate a section", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [
          {
            pages: [
              {
                title: "title-1",
                alias: "alias-1",
                description: "description-1",
                guidance: "guidance-1",
                definitionLabel: "definitionLabel-1",
                definitionContent: "definitionContent-1",
                additionalInfoLabel: "additionalInfoLabel-1",
                additionalInfoContent: "additionalInfoContent-1",
              },
            ],
          },
        ],
      });
      const page = getFirstPage(questionnaire);
      const update = {
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
      const updatedPage = await updateQuestionPage(questionnaire, update);
      expect(updatedPage).toEqual(expect.objectContaining(update));
    });
  });

  describe("move", () => {
    describe("within a section", () => {
      beforeEach(async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [{}, {}],
            },
          ],
        });
      });

      it("should be able to move a page later", async () => {
        const section = questionnaire.sections[0];
        const pageToMoveId = section.pages[0].id;
        const secondPageId = section.pages[1].id;

        const {
          section: { pages },
        } = await moveQuestionPage(questionnaire, {
          id: pageToMoveId,
          sectionId: section.id,
          position: 1,
        });
        expect(pages.map(p => p.id)).toEqual([secondPageId, pageToMoveId]);
      });

      it("should be able to move a section earlier", async () => {
        const section = questionnaire.sections[0];
        const firstPageId = section.pages[0].id;
        const pageToMoveId = section.pages[1].id;

        const {
          section: { pages },
        } = await moveQuestionPage(questionnaire, {
          id: pageToMoveId,
          sectionId: section.id,
          position: 0,
        });
        expect(pages.map(p => p.id)).toEqual([pageToMoveId, firstPageId]);
      });
    });

    describe("between sections", () => {
      it("should be able to move sections to any position in another section", async () => {
        questionnaire = await buildQuestionnaire({
          sections: [
            {
              pages: [{}, {}],
            },
            {
              pages: [{}, {}],
            },
          ],
        });

        const newSection = questionnaire.sections[1];
        const originalPages = [...newSection.pages];

        const pageToMoveId = getFirstPage(questionnaire).id;

        const {
          section: { id, pages },
        } = await moveQuestionPage(questionnaire, {
          id: pageToMoveId,
          sectionId: newSection.id,
          position: 1,
        });

        expect(id).toEqual(newSection.id);
        expect(pages.map(p => p.id)).toEqual([
          originalPages[0].id,
          pageToMoveId,
          originalPages[1].id,
        ]);
      });
    });
  });

  describe("query", () => {
    let queriedPage, setupPage;

    beforeAll(async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [{}],
        sections: [
          {
            pages: [
              {
                answers: [{ type: NUMBER }],
              },
              {
                title: "title-1",
                alias: "alias-1",
                description: "description-1",
                guidance: "guidance-1",
                definitionLabel: "definitionLabel-1",
                definitionContent: "definitionContent-1",
                additionalInfoLabel: "additionalInfoLabel-1",
                additionalInfoContent: "additionalInfoContent-1",
                confirmation: {},
                answers: [{ type: NUMBER }],
              },
            ],
          },
        ],
      });
    });

    beforeEach(async () => {
      setupPage = questionnaire.sections[0].pages[1];
      queriedPage = await queryQuestionPage(questionnaire, setupPage.id);
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
      expect(queriedPage.answers).toEqual([
        expect.objectContaining({ id: setupPage.answers[0].id }),
      ]);
    });

    it("should resolve section", () => {
      expect(queriedPage.section.id).toEqual(questionnaire.sections[0].id);
    });

    it("should resolve availablePipingAnswers", () => {
      expect(last(queriedPage.availablePipingAnswers).id).toEqual(
        get(questionnaire, "sections[0].pages[0].answers[0].id")
      );
    });

    it("should resolve availablePipingMetadata", () => {
      expect(last(queriedPage.availablePipingMetadata).id).toEqual(
        last(questionnaire.metadata).id
      );
    });

    it("should resolve availableRoutingAnswers", () => {
      expect(last(queriedPage.availableRoutingAnswers).id).toEqual(
        get(questionnaire, "sections[0].pages[0].answers[0].id")
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
      expect(queriedPage.confirmation.id).toEqual(setupPage.confirmation.id);
    });

    it("should resolve routing", () => {
      //@todo
    });
  });

  describe("delete", () => {
    it("should delete a page", async () => {
      questionnaire = await buildQuestionnaire({ sections: [{ pages: [{}] }] });
      const page = questionnaire.sections[0].pages[0];
      await deleteQuestionPage(questionnaire, page.id);
      const deletedQuestionPage = await queryQuestionPage(
        questionnaire,
        page.id
      );
      expect(deletedQuestionPage).toBeNull();
    });
  });
});
