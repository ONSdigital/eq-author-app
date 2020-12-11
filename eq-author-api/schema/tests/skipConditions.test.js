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

const {
  queryPage,
  movePage,
  deletePage,
} = require("../../tests/utils/contextBuilder/page");

const {
  querySection,
  deleteSection,
  moveSection,
} = require("../../tests/utils/contextBuilder/section");

const {
  queryQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const { getFolderById } = require("../resolvers/utils");

const config = {
  metadata: [{}],
  sections: [
    {
      title: "title-1",
      alias: "alias-1",
      position: 0,
      folders: [
        {
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
    },
  ],
};

describe("skip conditions", () => {
  let ctx, questionnaire;

  describe("expression group", () => {
    it("should create an expression group and default expresiion", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].folders[0].pages[0];

      createSkipCondition(ctx, page);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );
    });

    it("should delete an existing expression group", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].folders[0].pages[0];
      await createSkipCondition(ctx, page);

      expect(page.skipConditions.length).toBe(1);
      await deleteSkipCondition(ctx, page.skipConditions[0].id);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions).toBeNull();
    });

    it("should delete all existing expression groups on a page", async () => {
      const ctx = await buildContext(config);
      const { questionnaire } = ctx;
      const page = questionnaire.sections[0].folders[0].pages[0];
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
      const page = questionnaire.sections[0].folders[0].pages[0];

      await createSkipCondition(ctx, page);
      const expressionGroup =
        ctx.questionnaire.sections[0].folders[0].pages[0].skipConditions[0];
      await createBinaryExpression(ctx, expressionGroup);
      const result = await queryPage(ctx, page.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );
    });
  });
  describe("move or delete a page", () => {
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [{}, {}],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
    });
    it("should remove skip conditions on first page when a page is moved", async () => {
      const section = questionnaire.sections[0];
      const folder = section.folders[0];
      const [page1, page2] = folder.pages;

      await createSkipCondition(ctx, page2);
      var result = await queryPage(ctx, page2.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );

      await movePage(ctx, {
        id: page2.id,
        sectionId: section.id,
        folderId: folder.id,
        position: 0,
      });

      const reorderedPageIds = getFolderById(ctx, folder.id).pages.map(
        ({ id }) => id
      );
      expect(reorderedPageIds).toEqual([page2.id, page1.id]);

      result = await queryPage(ctx, page2.id);
      expect(result.skipConditions).toBeNull();
    });
    it("should remove skip conditions on first page when a page is deleted", async () => {
      const section = questionnaire.sections[0];
      const [page1, page2] = section.folders[0].pages;

      await createSkipCondition(ctx, page2);
      var result = await queryPage(ctx, page2.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );

      await deletePage(ctx, page1.id);
      const deletedPage = await queryPage(ctx, page1.id);
      expect(deletedPage).toBeNull();

      result = await queryPage(ctx, page2.id);
      expect(result.skipConditions).toBeNull();
    });
  });
  describe("move or delete a section", () => {
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [{ pages: [{}] }],
          },
          {
            folders: [{ pages: [{}] }],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
    });
    it("should remove skip conditions on first page when a section is moved", async () => {
      const section1 = questionnaire.sections[0];
      const section2 = questionnaire.sections[1];
      const page2 = section2.folders[0].pages[0];

      await createSkipCondition(ctx, page2);
      var result = await queryPage(ctx, page2.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );

      await moveSection(ctx, {
        id: section1.id,
        questionnaireId: questionnaire.id,
        position: 1,
      });
      const { sections } = await queryQuestionnaire(ctx);
      expect(sections.map(s => s.id)).toEqual([section2.id, section1.id]);

      result = await queryPage(ctx, page2.id);
      expect(result.skipConditions).toBeNull();
    });
    it("should remove skip conditions on first page when a sectyion is deleted", async () => {
      const section1 = questionnaire.sections[0];
      const section2 = questionnaire.sections[1];
      const page2 = section2.folders[0].pages[0];

      await createSkipCondition(ctx, page2);
      var result = await queryPage(ctx, page2.id);
      expect(result.skipConditions[0].expressions[0].left.reason).toBe(
        "DefaultSkipCondition"
      );

      await deleteSection(ctx, section1.id);
      const deletedSection = await querySection(ctx, section1.id);
      expect(deletedSection).toBeNull();

      result = await queryPage(ctx, page2.id);
      expect(result.skipConditions).toBeNull();
    });
  });
});
