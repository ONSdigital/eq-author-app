const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  createQuestionConfirmation,
  updateQuestionConfirmation,
  queryQuestionConfirmation,
  deleteQuestionConfirmation,
} = require("../../tests/utils/contextBuilder/questionConfirmation");

const { NUMBER } = require("../../constants/answerTypes");

describe("questionConfirmation", () => {
  let ctx, questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("create", () => {
    it("should create a question confirmation", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [{}],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      const questionConfirmation = await createQuestionConfirmation(ctx, {
        pageId: questionnaire.sections[0].folders[0].pages[0].id,
      });
      expect(questionConfirmation).toEqual(
        expect.objectContaining({
          title: "",
          negative: {
            description: "",
            label: "",
          },
          positive: {
            description: "",
            label: "",
          },
        })
      );
    });
  });

  describe("mutate", () => {
    it("should mutate a questionConfirmation", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    confirmation: {},
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      ctx.comments = {};
      const update = {
        id: questionnaire.sections[0].folders[0].pages[0].confirmation.id,
        title: "title-updated",
        negative: {
          label: "negative-label-updated",
          description: "negative-description-updated",
        },
        positive: {
          label: "positive-label-updated",
          description: "positive-description-updated",
        },
      };
      const updatedQuestionConfirmation = await updateQuestionConfirmation(
        ctx,
        update
      );

      expect(updatedQuestionConfirmation).toMatchObject(update);
    });
  });

  describe("query", () => {
    let queriedQuestionConfirmation;

    beforeEach(async () => {
      ctx = await buildContext({
        metadata: [{}],
        comments: {},
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
                    confirmation: {
                      positive: {
                        label: "pos label",
                        description: "pos desc",
                      },
                      negative: {
                        label: "neg label",
                        description: "neg desc",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      queriedQuestionConfirmation = await queryQuestionConfirmation(
        ctx,
        questionnaire.sections[0].folders[0].pages[0].confirmation.id
      );
    });

    it("should resolve questionConfirmation fields", () => {
      expect(queriedQuestionConfirmation).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        page: expect.any(Object),
        positive: expect.any(Object),
        negative: expect.any(Object),
      });
    });

    it("should resolve page", () => {
      expect(queriedQuestionConfirmation.page.id).toEqual(
        questionnaire.sections[0].folders[0].pages[0].id
      );
    });

    it("should resolve positive", () => {
      expect(queriedQuestionConfirmation.positive).toMatchObject({
        label: "pos label",
        description: "pos desc",
      });
    });

    it("should resolve negative", () => {
      expect(queriedQuestionConfirmation.negative).toMatchObject({
        label: "neg label",
        description: "neg desc",
      });
    });
  });

  describe("delete", () => {
    it("should delete a question confirmation", async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    confirmation: {},
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;

      const confirmationId =
        questionnaire.sections[0].folders[0].pages[0].confirmation.id;
      await deleteQuestionConfirmation(ctx, confirmationId);
      const deletedQuestionConfirmation = await queryQuestionConfirmation(
        ctx,
        confirmationId
      );
      expect(deletedQuestionConfirmation).toBeNull();
    });
  });

  describe("validate", () => {
    let queriedQuestionConfirmation;

    beforeEach(async () => {
      ctx = await buildContext({
        metadata: [{}],
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
                    confirmation: {
                      positive: {
                        label: "pos label",
                        description: "pos desc",
                      },
                      negative: {
                        label: "neg label",
                        description: "neg desc",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      });

      questionnaire = ctx.questionnaire;

      queriedQuestionConfirmation = await queryQuestionConfirmation(
        ctx,
        questionnaire.sections[0].folders[0].pages[0].confirmation.id
      );
    });

    it("should provide validation info", () => {
      expect(queriedQuestionConfirmation).toHaveProperty("validationErrorInfo");
      expect(queriedQuestionConfirmation.positive).toHaveProperty(
        "validationErrorInfo"
      );
      expect(queriedQuestionConfirmation.negative).toHaveProperty(
        "validationErrorInfo"
      );
    });
  });

  describe("comments", () => {
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    confirmation: {},
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
      ctx.comments = {};
    });

    it("should retrieve comments from context", async () => {
      const confirmation =
        questionnaire.sections[0].folders[0].pages[0].confirmation;

      ctx.comments[confirmation.id] = [
        {
          id: "comment-1",
          commentText: "Test comment 1",
        },
        {
          id: "comment-2",
          commentText: "Test comment 2",
        },
      ];

      const updatedQuestionConfirmation = await updateQuestionConfirmation(
        ctx,
        { id: confirmation.id }
      );

      expect(updatedQuestionConfirmation.comments).toEqual(
        expect.arrayContaining(ctx.comments[confirmation.id])
      );
    });
  });
});
