const { last, omit } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  queryQuestionnaire,
  deleteQuestionnaire,
  duplicateQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  querySection,
  deleteSection,
  duplicateSection,
} = require("../../tests/utils/contextBuilder/section");

const {
  queryPage,
  deletePage,
  duplicatePage,
} = require("../../tests/utils/contextBuilder/page");

const { getQuestionnaire } = require("../../utils/datastore");

describe("Duplication", () => {
  let ctx, questionnaire, section;
  let config = {
    shortTitle: "short title",
    sections: [
      {
        title: "section-title-1",
        alias: "section-alias-alias-1",
        pages: [
          {
            title: "page-title-1",
            alias: "page-alias-alias-1",
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    ctx = await buildContext(config);
    questionnaire = ctx.questionnaire;
    section = last(questionnaire.sections);
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("duplicate a page", () => {
    let page, pageCopy;

    beforeEach(async () => {
      page = await queryPage(ctx, last(section.pages).id);
      let { id } = await duplicatePage(ctx, page);
      pageCopy = await queryPage(ctx, id);
    });

    afterEach(async () => {
      await deletePage(ctx, pageCopy.id);
    });

    it("should copy page with answers and question confirmation", () => {
      expect(pageCopy).toEqual(
        expect.objectContaining(
          omit(page, ["id", "alias", "title", "displayName", "position"])
        )
      );
    });

    it("should have new id", () => {
      expect(pageCopy.id).not.toEqual(page.id);
    });

    it("should create new title", () => {
      expect(pageCopy.title).toEqual(`Copy of ${page.title}`);
    });

    it("should correctly increment position", () => {
      expect(pageCopy.position).toEqual(page.position + 1);
    });
  });

  describe("duplicate a section", () => {
    let queriedSection;
    let sectionCopy;

    beforeEach(async () => {
      queriedSection = await querySection(ctx, section.id);
      let { id } = await duplicateSection(ctx, queriedSection);
      sectionCopy = await querySection(ctx, id);
    });

    afterEach(async () => {
      await deleteSection(ctx, sectionCopy.id);
    });

    it("should copy section with pages", () => {
      expect(sectionCopy).toEqual(
        expect.objectContaining(
          omit(queriedSection, [
            "id",
            "alias",
            "title",
            "displayName",
            "position",
            "pages",
          ])
        )
      );
    });

    it("should copy the page but not id", () => {
      expect(sectionCopy.pages[0].id).not.toEqual(queriedSection.pages[0].id);
      expect(sectionCopy.pages[0]).toMatchObject(
        omit(queriedSection.pages[0], "id")
      );
    });

    it("should have new id", () => {
      expect(sectionCopy.id).not.toEqual(queriedSection.id);
    });

    it("should create new title", () => {
      expect(sectionCopy.title).toEqual(`Copy of ${queriedSection.title}`);
    });

    it("should correctly increment position", async () => {
      expect(sectionCopy.position).toEqual(queriedSection.position + 1);
    });
  });

  describe("duplicate a questionnaire", () => {
    let queriedQuestionnaire;
    let questionnaireCopy;
    let duplicatedQuestionnaire;
    let databaseCopy;
    let duplicatedContext;

    beforeEach(async () => {
      queriedQuestionnaire = await queryQuestionnaire(ctx);
      duplicatedQuestionnaire = await duplicateQuestionnaire(ctx);
      databaseCopy = await getQuestionnaire(duplicatedQuestionnaire.id);

      duplicatedContext = {
        questionnaire: databaseCopy,
        user: ctx.user,
      };

      questionnaireCopy = await queryQuestionnaire(duplicatedContext);
    });

    afterEach(async () => {
      await deleteQuestionnaire(duplicatedContext, questionnaireCopy.id);
    });

    it("should copy questionnaire with sections and pages", () => {
      const ignoredFields = [
        "id",
        "title",
        "shortTitle",
        "displayName",
        "createdBy",
      ];
      expect(omit(questionnaireCopy, ignoredFields)).toEqual(
        omit(queriedQuestionnaire, ignoredFields)
      );
    });

    it("should have new id", () => {
      expect(questionnaireCopy.id).not.toEqual(queriedQuestionnaire.id);
    });

    it("should create new title and short title", () => {
      expect(questionnaireCopy.title).toEqual(
        `Copy of ${queriedQuestionnaire.title}`
      );
      expect(questionnaireCopy.shortTitle).toEqual(
        `Copy of ${queriedQuestionnaire.shortTitle}`
      );
    });
  });
});
