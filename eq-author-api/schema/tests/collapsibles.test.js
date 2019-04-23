const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  queryCollapsible,
  createCollapsible,
  updateCollapsible,
  moveCollapsible,
  deleteCollapsible,
} = require("../../tests/utils/questionnaireBuilder/collapsible");

const { BUSINESS } = require("../../constants/questionnaireTypes");

describe("questionnaire", () => {
  let questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
    questionnaire = null;
  });

  describe("read", () => {
    it("should return the collapsibles on the introduction", async () => {
      questionnaire = await buildQuestionnaire({
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

      const collapsibles = await queryCollapsible(
        questionnaire,
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
      questionnaire = await buildQuestionnaire({ type: BUSINESS });
      const collapsible = await createCollapsible(questionnaire, {
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
      questionnaire = await buildQuestionnaire({
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

      const collapsible = await updateCollapsible(questionnaire, {
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
      questionnaire = await buildQuestionnaire({
        type: BUSINESS,
        introduction: {
          collapsibles: [{}, {}],
        },
      });

      const collapsibleIds = questionnaire.introduction.collapsibles.map(
        c => c.id
      );
      const [collapsible1Id, collapsible2Id] = collapsibleIds;

      const result = await moveCollapsible(questionnaire, {
        id: collapsible2Id,
        position: 0,
      });
      expect(result.introduction.collapsibles.map(c => c.id)).toEqual([
        collapsible2Id,
        collapsible1Id,
      ]);
    });

    it("should move the collapsible backward", async () => {
      questionnaire = await buildQuestionnaire({
        type: BUSINESS,
        introduction: {
          collapsibles: [{}, {}],
        },
      });

      const collapsibleIds = questionnaire.introduction.collapsibles.map(
        c => c.id
      );
      const [collapsible1Id, collapsible2Id] = collapsibleIds;

      const result = await moveCollapsible(questionnaire, {
        id: collapsible1Id,
        position: 1,
      });
      expect(result.introduction.collapsibles.map(c => c.id)).toEqual([
        collapsible2Id,
        collapsible1Id,
      ]);
    });
  });

  describe("delete", () => {
    it("should remove the collapsible", async () => {
      questionnaire = await buildQuestionnaire({
        type: BUSINESS,
        introduction: {
          collapsibles: [{}, {}],
        },
      });

      const collapsibleIds = questionnaire.introduction.collapsibles.map(
        c => c.id
      );
      const [collapsible1Id, collapsible2Id] = collapsibleIds;

      const introduction = await deleteCollapsible(questionnaire, {
        id: collapsible1Id,
      });

      expect(introduction.collapsibles.map(c => c.id)).toEqual([
        collapsible2Id,
      ]);
    });
  });
});
