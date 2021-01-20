const { buildContext } = require("../../tests/utils/contextBuilder");
const { queryPage } = require("../../tests/utils/contextBuilder/page");
const {
  createAnswer,
  deleteAnswer,
} = require("../../tests/utils/contextBuilder/answer");
const {
  toggleValidation,
  updateValidation,
} = require("../../tests/utils/contextBuilder/validation");

const { NUMBER, CURRENCY, PERCENTAGE } = require("../../constants/answerTypes");
const {
  CUSTOM,
  PREVIOUS_ANSWER,
} = require("../../constants/validationEntityTypes");
const {
  EQUAL,
  LESS_THAN_EQUAL,
} = require("../../constants/validationConditions");

describe("Answer group validation", () => {
  let ctx, questionnaire;
  describe("creation", () => {
    it("should create a answer group validation for the second numeric answer", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      const page = await queryPage(ctx, pageId);

      expect(page.totalValidation).toBeNull();

      await createAnswer(ctx, {
        questionPageId: pageId,
        type: NUMBER,
      });

      const updatePage = await queryPage(ctx, pageId);
      expect(updatePage.totalValidation).toEqual({
        id: expect.any(String),
        entityType: CUSTOM,
        condition: EQUAL,
        enabled: false,
        custom: null,
        previousAnswer: null,
        availablePreviousAnswers: [],
      });
    });

    it("should remove the validation group when another answer type is added", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      const page = await queryPage(ctx, pageId);

      expect(page.totalValidation).not.toBeNull();

      await createAnswer(ctx, {
        questionPageId: pageId,
        type: CURRENCY,
      });

      const updatedPage = await queryPage(ctx, pageId);
      expect(updatedPage.totalValidation).toBeNull();
    });

    it("should not add it even when a second is added", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                      {
                        type: NUMBER,
                      },
                      {
                        type: CURRENCY,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      const page = await queryPage(ctx, pageId);

      expect(page.totalValidation).toBeNull();

      await createAnswer(ctx, {
        questionPageId: pageId,
        type: CURRENCY,
      });

      const updatedPage = await queryPage(ctx, pageId);
      expect(updatedPage.totalValidation).toBeNull();
    });
  });

  describe("deletion", () => {
    it("should remove the validation when the second answer is removed", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: CURRENCY,
                      },
                      {
                        type: CURRENCY,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      const page = await queryPage(ctx, pageId);

      expect(page.totalValidation).not.toBeNull();

      await deleteAnswer(ctx, page.answers[0].id);

      const updatedPage = await queryPage(ctx, pageId);
      expect(updatedPage.totalValidation).toBeNull();
    });

    it("should add the validation when the last blocking type is removed", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: CURRENCY,
                      },
                      {
                        type: CURRENCY,
                      },
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      const page = await queryPage(ctx, pageId);

      expect(page.totalValidation).toBeNull();

      await deleteAnswer(ctx, page.answers[2].id);

      const updatedPage = await queryPage(ctx, pageId);
      expect(updatedPage.totalValidation).not.toBeNull();
    });
  });

  describe("mutation", () => {
    it("can be toggled on", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: PERCENTAGE,
                      },
                      {
                        type: PERCENTAGE,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const page = questionnaire.sections[0].folders[0].pages[0];
      const totalValidation = page.totalValidation;

      expect(totalValidation.enabled).toBe(false);

      await toggleValidation(ctx, {
        id: totalValidation.id,
        enabled: true,
      });

      const updatedPage = await queryPage(ctx, page.id);

      expect(updatedPage.totalValidation.enabled).toBe(true);
    });

    it("can be changed to a custom value", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: NUMBER,
                      },
                      {
                        type: NUMBER,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const page = questionnaire.sections[0].folders[0].pages[0];
      const totalValidation = page.totalValidation;

      expect(totalValidation).toMatchObject({
        custom: null,
        condition: EQUAL,
        entityType: CUSTOM,
      });

      await updateValidation(ctx, {
        id: totalValidation.id,
        totalInput: {
          custom: 5,
          condition: LESS_THAN_EQUAL,
          entityType: CUSTOM,
        },
      });

      const updatedPage = await queryPage(ctx, page.id);

      expect(updatedPage.totalValidation).toMatchObject({
        custom: 5,
        condition: LESS_THAN_EQUAL,
        entityType: CUSTOM,
      });
    });

    it("can be changed to a previous answer", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [{ type: PERCENTAGE }],
                  },
                  {
                    answers: [
                      {
                        type: PERCENTAGE,
                      },
                      {
                        type: PERCENTAGE,
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const page = questionnaire.sections[0].folders[0].pages[1];
      const totalValidation = page.totalValidation;
      const previousAnswerId =
        questionnaire.sections[0].folders[0].pages[0].answers[0].id;

      expect(totalValidation).toMatchObject({
        previousAnswer: null,
        condition: EQUAL,
        entityType: CUSTOM,
      });

      await updateValidation(ctx, {
        id: totalValidation.id,
        totalInput: {
          previousAnswer: previousAnswerId,
          condition: LESS_THAN_EQUAL,
          entityType: PREVIOUS_ANSWER,
        },
      });

      const updatedPage = await queryPage(ctx, page.id);

      expect(updatedPage.totalValidation).toMatchObject({
        custom: null,
        condition: LESS_THAN_EQUAL,
        entityType: PREVIOUS_ANSWER,
        previousAnswer: {
          id: previousAnswerId,
        },
        availablePreviousAnswers: [
          {
            id: previousAnswerId,
          },
        ],
      });
    });
  });
});
