const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryCollapsible,
  createCollapsible,
  updateCollapsible,
  moveCollapsible,
  deleteCollapsible,
} = require("../../tests/utils/contextBuilder/collapsible");

const { BUSINESS } = require("../../constants/questionnaireTypes");

describe("questionnaire", () => {
  let ctx, questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("read", () => {
    it("should return the collapsibles on the introduction", async () => {
      ctx = await buildContext({
        type: BUSINESS,
        introduction: {
          collapsibles: [
            {
              title: "Collapsible title",
              description: "Collapsible description",
            },
          ],
        },
      });
      questionnaire = ctx.questionnaire;

      const collapsibles = await queryCollapsible(
        ctx,
        questionnaire.introduction.id
      );
      expect(collapsibles).toEqual([
        {
          id: expect.any(String),
          title: "Collapsible title",
          description: "Collapsible description",
          introduction: {
            id: questionnaire.introduction.id,
          },
        },
      ]);
    });
  });

  describe("create", () => {
    it("should add a collapsible", async () => {
      ctx = await buildContext({ type: BUSINESS });
      questionnaire = ctx.questionnaire;

      const collapsible = await createCollapsible(ctx, {
        introductionId: questionnaire.introduction.id,
        title: "Some title",
        description: "Some description",
      });
      expect(collapsible).toEqual({
        id: expect.any(String),
        title: "Some title",
        description: "Some description",
        introduction: {
          id: questionnaire.introduction.id,
        },
      });
    });
  });

  describe("update", () => {
    it("should update the properties", async () => {
      ctx = await buildContext({
        type: BUSINESS,
        introduction: {
          collapsibles: [
            {
              title: "Collapsible title",
              description: "Collapsible description",
            },
          ],
        },
      });
      questionnaire = ctx.questionnaire;

      const collapsible = await updateCollapsible(ctx, {
        id: questionnaire.introduction.collapsibles[0].id,
        title: "Some title",
        description: "Some description",
      });

      expect(collapsible).toEqual({
        id: questionnaire.introduction.collapsibles[0].id,
        title: "Some title",
        description: "Some description",
      });
    });
  });

  describe("move", () => {
    it("should move the collapsible forward", async () => {
      ctx = await buildContext({
        type: BUSINESS,
        introduction: {
          collapsibles: [{}, {}],
        },
      });
      questionnaire = ctx.questionnaire;

      const collapsibleIds = questionnaire.introduction.collapsibles.map(
        (c) => c.id
      );
      const [collapsible1Id, collapsible2Id] = collapsibleIds;

      const result = await moveCollapsible(ctx, {
        id: collapsible2Id,
        position: 0,
      });
      expect(result.introduction.collapsibles.map((c) => c.id)).toEqual([
        collapsible2Id,
        collapsible1Id,
      ]);
    });

    it("should move the collapsible backward", async () => {
      ctx = await buildContext({
        type: BUSINESS,
        introduction: {
          collapsibles: [{}, {}],
        },
      });
      questionnaire = ctx.questionnaire;

      const collapsibleIds = questionnaire.introduction.collapsibles.map(
        (c) => c.id
      );
      const [collapsible1Id, collapsible2Id] = collapsibleIds;

      const result = await moveCollapsible(ctx, {
        id: collapsible1Id,
        position: 1,
      });
      expect(result.introduction.collapsibles.map((c) => c.id)).toEqual([
        collapsible2Id,
        collapsible1Id,
      ]);
    });
  });

  describe("delete", () => {
    it("should remove the collapsible", async () => {
      ctx = await buildContext({
        type: BUSINESS,
        introduction: {
          collapsibles: [{}, {}],
        },
      });
      questionnaire = ctx.questionnaire;

      const collapsibleIds = questionnaire.introduction.collapsibles.map(
        (c) => c.id
      );
      const [collapsible1Id, collapsible2Id] = collapsibleIds;

      const introduction = await deleteCollapsible(ctx, {
        id: collapsible1Id,
      });

      expect(introduction.collapsibles.map((c) => c.id)).toEqual([
        collapsible2Id,
      ]);
    });
  });
});
