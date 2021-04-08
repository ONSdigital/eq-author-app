const { last, omit } = require("lodash");
const deepMap = require("deep-map");

const { buildContext } = require("../../tests/utils/contextBuilder");
const validateQuestionnaire = require("../../src/validation");

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

const { getFolderByPageId } = require("../resolvers/utils");

const { getQuestionnaire } = require("../../db/datastore");

describe("Duplication", () => {
  let ctx, questionnaire, section, folder;
  let config = {
    shortTitle: "short title",
    navigation: true,
    sections: [
      {
        title: "section-title-1",
        alias: "section-alias-alias-1",
        folders: [
          {
            pages: [
              {
                title: "page-title-1",
                alias: "page-alias-alias-1",
                answers: [],
              },
            ],
          },
        ],
      },
    ],
  };

  beforeEach(async () => {
    ctx = await buildContext(config);
    questionnaire = ctx.questionnaire;
    section = last(questionnaire.sections);
    folder = last(section.folders);
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("duplicate a page", () => {
    let page, pageCopy;

    beforeEach(async () => {
      page = await queryPage(ctx, last(folder.pages).id);
      let { id } = await duplicatePage(ctx, page);
      pageCopy = await queryPage(ctx, id);
    });

    afterEach(async () => {
      await deletePage(ctx, pageCopy.id);
    });

    it("should copy page with answers and question confirmation", () => {
      const cleanObject = (obj) => {
        const objectWithUnchangedFields = omit(
          JSON.parse(JSON.stringify(obj)),
          ["alias", "title", "displayName", "position"]
        );
        return deepMap(objectWithUnchangedFields, (value, key) => {
          if (key === "id") {
            return "someId";
          }
          return value;
        });
      };
      expect(cleanObject(pageCopy)).toMatchObject(cleanObject(page));
    });

    it("should have new id", () => {
      expect(pageCopy.id).not.toEqual(page.id);
    });

    it("should create new title", () => {
      expect(pageCopy.title).toEqual(`Copy of ${page.title}`);
    });

    it("should be created in new folder if parent folder disabled", () => {
      expect(pageCopy.position).toEqual(0);
    });

    it("should be created in same folder if parent folder enabled", async () => {
      const folder = getFolderByPageId(ctx, page.id);
      folder.enabled = true;
      let { id } = await duplicatePage(ctx, page);
      pageCopy = await queryPage(ctx, id);

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
            "folders",
          ])
        )
      );
    });

    it("should copy the page but not id", () => {
      expect(sectionCopy.folders[0].pages[0].id).not.toEqual(
        queriedSection.folders[0].pages[0].id
      );
      expect(sectionCopy.folders[0].pages[0]).toMatchObject(
        omit(queriedSection.folders[0].pages[0], "id")
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
        validationErrorInfo: validateQuestionnaire(ctx.questionnaire),
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
        "createdAt",
        "locked",
      ];
      expect(omit(questionnaireCopy, ignoredFields)).toEqual(
        omit(queriedQuestionnaire, ignoredFields)
      );
    });

    it("should have new id", () => {
      expect(questionnaireCopy.id).not.toEqual(queriedQuestionnaire.id);
    });

    it("should create duplicate unlocked", () => {
      expect(questionnaireCopy.locked).toBe(false);
    });

    it("should create new title and short title", () => {
      expect(questionnaireCopy.title).toEqual(
        `Copy of ${queriedQuestionnaire.title}`
      );
      expect(questionnaireCopy.shortTitle).toEqual(
        `Copy of ${queriedQuestionnaire.shortTitle}`
      );
    });

    it("should have createdAt greater than original", () => {
      const copyDate = Date.parse(questionnaireCopy.createdAt);
      const queriedDate = Date.parse(queriedQuestionnaire.createdAt);
      expect(copyDate).toBeGreaterThan(queriedDate);
    });
  });
});
