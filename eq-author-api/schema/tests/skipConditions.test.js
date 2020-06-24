const { buildContext } = require("../../tests/utils/contextBuilder");
const { RADIO } = require("../../constants/answerTypes");
const {
  createSkipCondition,
  deleteSkipCondition,
  deleteSkipConditions,
} = require("../../tests/utils/contextBuilder/skipConditions");
const {
  createBinaryExpression,
} = require("../../tests/utils/contextBuilder/routing");

const { queryPage } = require("../../tests/utils/contextBuilder/page");

const config = {
  metadata: [{}],
  sections: [
    {
      title: "title-1",
      alias: "alias-1",
      position: 0,
      pages: [
        {
          title: "page-1",
          parentSection: "title-1",
          answers: [
            {
              type: RADIO,
            },
          ],
        },
      ],
    },
  ],
};

describe("skip conditions", () => {
  describe("expression group", () => {
    it("should create an expression group and default expresiion", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].pages[0];

      createSkipCondition(ctx, page);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );
    });

    it("should delete an existing expression group", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].pages[0];
      const { id } = await createSkipCondition(ctx, page);

      expect(page.skipConditions.length).toBe(1);
      await deleteSkipCondition(ctx, id);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions).toBeNull();
    });

    it("should delete all existing expression groups on a page", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].pages[0];
      createSkipCondition(ctx, page);
      createSkipCondition(ctx, page);

      expect(page.skipConditions.length).toBe(2);
      await deleteSkipConditions(ctx, page);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions).toBeNull();
    });
  });
  describe("binary Expression", () => {
    it("should add a binary exporession to an existing expression group", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].pages[0];

      await createSkipCondition(ctx, page);
      const expressionGroup =
        ctx.questionnaire.sections[0].pages[0].skipConditions[0];
      await createBinaryExpression(ctx, expressionGroup);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );
    });
  });
});
