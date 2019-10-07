const { last, get } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  queryPage,
  deletePage,
  movePage,
} = require("../../tests/utils/contextBuilder/page");

const {
  createQuestionPage,
  updateQuestionPage,
} = require("../../tests/utils/contextBuilder/page/questionPage");

const { DATE, NUMBER, CHECKBOX } = require("../../constants/answerTypes");
const {
  NEXT_PAGE,
  END_OF_QUESTIONNAIRE,
} = require("../../constants/logicalDestinations");

const getFirstPage = questionnaire => questionnaire.sections[0].pages[0];

describe("page", () => {
  let ctx, questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("create", () => {
    it("should create a page", async () => {
      ctx = await buildContext({
        sections: [{}],
      });
      questionnaire = ctx.questionnaire;
      const section = questionnaire.sections[0];

      const createdPage = await createQuestionPage(ctx, {
        title: "Title",
        description: "Description",
        sectionId: section.id,
        descriptionEnabled: true,
        guidanceEnabled: true,
        definitionEnabled: true,
        additionalInfoEnabled: true,
      });
      expect(createdPage).toMatchObject({
        title: "Title",
        description: "Description",
        position: 0,
        descriptionEnabled: true,
        guidanceEnabled: true,
        definitionEnabled: true,
        additionalInfoEnabled: true,
      });
    });

    it("should create at a given position", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [{}],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const section = questionnaire.sections[0];

      const createdPage = await createQuestionPage(ctx, {
        title: "Title",
        description: "Description",
        sectionId: section.id,
        position: 0,
      });

      const readPage = await queryPage(ctx, createdPage.id);

      expect(readPage).toMatchObject({
        title: "Title",
        description: "Description",
        position: 0,
      });
    });
  });

  describe("mutate", () => {
    it("should mutate a section", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                title: "title-1",
                alias: "alias-1",
                description: "description-1",
                descriptionEnabled: true,
                guidance: "guidance-1",
                guidanceEnabled: true,
                definitionLabel: "definitionLabel-1",
                definitionContent: "definitionContent-1",
                definitionEnabled: true,
                additionalInfoLabel: "additionalInfoLabel-1",
                additionalInfoContent: "additionalInfoContent-1",
                additionalInfoEnabled: true,
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const page = getFirstPage(questionnaire);
      const update = {
        id: page.id,
        title: "title-updated",
        alias: "alias-updated",
        description: "description-updated",
        descriptionEnabled: false,
        guidance: "guidance-updated",
        guidanceEnabled: false,
        definitionLabel: "definitionLabel-updated",
        definitionContent: "definitionContent-updated",
        definitionEnabled: false,
        additionalInfoLabel: "additionalInfoLabel-updated",
        additionalInfoContent: "additionalInfoContent-updated",
        additionalInfoEnabled: false,
      };
      const updatedPage = await updateQuestionPage(ctx, update);
      expect(updatedPage).toEqual(expect.objectContaining(update));
    });
  });

  describe("move", () => {
    describe("within a section", () => {
      beforeEach(async () => {
        ctx = await buildContext({
          sections: [
            {
              pages: [{}, {}],
            },
          ],
        });
        questionnaire = ctx.questionnaire;
      });

      it("should be able to move a page later", async () => {
        const section = questionnaire.sections[0];
        const pageToMoveId = section.pages[0].id;
        const secondPageId = section.pages[1].id;

        const {
          section: { pages },
        } = await movePage(ctx, {
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
        } = await movePage(ctx, {
          id: pageToMoveId,
          sectionId: section.id,
          position: 0,
        });
        expect(pages.map(p => p.id)).toEqual([pageToMoveId, firstPageId]);
      });
    });

    describe("between sections", () => {
      it("should be able to move sections to any position in another section", async () => {
        ctx = await buildContext({
          sections: [
            {
              pages: [{}, {}],
            },
            {
              pages: [{}, {}],
            },
          ],
        });
        questionnaire = ctx.questionnaire;
        const newSection = questionnaire.sections[1];
        const originalPages = [...newSection.pages];

        const pageToMoveId = getFirstPage(questionnaire).id;

        const {
          section: { id, pages },
        } = await movePage(ctx, {
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

    beforeEach(async () => {
      ctx = await buildContext({
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
                answers: [{ type: DATE }],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      setupPage = questionnaire.sections[0].pages[1];
      queriedPage = await queryPage(ctx, setupPage.id);
    });

    it("should resolve page fields", () => {
      expect(queriedPage).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        alias: expect.any(String),
        displayName: expect.any(String),
        description: expect.any(String),
        descriptionEnabled: expect.any(Boolean),
        guidance: expect.any(String),
        guidanceEnabled: expect.any(Boolean),
        pageType: expect.any(String),
        answers: expect.any(Array),
        section: expect.any(Object),
        position: expect.any(Number),
        definitionLabel: expect.any(String),
        definitionContent: expect.any(String),
        definitionEnabled: expect.any(Boolean),
        additionalInfoLabel: expect.any(String),
        additionalInfoContent: expect.any(String),
        additionalInfoEnabled: expect.any(Boolean),
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
  });

  describe("delete", () => {
    it("should delete a page", async () => {
      ctx = await buildContext({ sections: [{ pages: [{}] }] });
      questionnaire = ctx.questionnaire;
      const page = questionnaire.sections[0].pages[0];
      await deletePage(ctx, page.id);
      const deletedQuestionPage = await queryPage(ctx, page.id);
      expect(deletedQuestionPage).toBeNull();
    });
  });

  describe("author validation", () => {
    it("should validate the page", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                title: "",
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const page = ctx.questionnaire.sections[0].pages[0];

      const readPage = await queryPage(ctx, page.id);

      expect(readPage).toMatchObject({
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            expect.objectContaining({ errorCode: "ERR_VALID_REQUIRED" }),
            expect.objectContaining({ errorCode: "ERR_NO_ANSWERS" }),
          ],
        },
      });
    });

    it("should include the count of errors on children", async () => {
      ctx = await buildContext({
        sections: [
          {
            pages: [
              {
                answers: [
                  {
                    type: CHECKBOX,
                    options: [
                      {
                        label: "",
                      },
                      { label: "" },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      questionnaire = ctx.questionnaire;
      const page = ctx.questionnaire.sections[0].pages[0];
      const optionOne = page.answers[0].options[0];
      const optionTwo = page.answers[0].options[1];

      const readPage = await queryPage(ctx, page.id);

      expect(readPage).toMatchObject({
        validationErrorInfo: {
          totalCount: 2,
          errors: [
            {
              errorCode: "ERR_VALID_REQUIRED",
              field: "label",
              id: `options-${optionOne.id}-label`,
              type: "options",
            },
            {
              errorCode: "ERR_VALID_REQUIRED",
              field: "label",
              id: `options-${optionTwo.id}-label`,
              type: "options",
            },
          ],
        },
      });
    });
  });
});
