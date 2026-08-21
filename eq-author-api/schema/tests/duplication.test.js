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

const { getQuestionnaire } = require("../../db/datastore");
const { logger } = require("../../utils/logger");

jest.mock("../../db/datastore", () => {
  const actual = jest.requireActual("../../db/datastore");
  return {
    ...actual,
    createQuestionnaire: jest.fn((...args) => actual.createQuestionnaire(...args)),
  };
});

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
          ["alias", "title", "displayName", "position", "pageDescription"]
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

    it("should be created in same folder if parent folder enabled", async () => {
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
        "validationErrorInfo",
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

  describe("duplicate a questionnaire with custom naming", () => {
    let queriedQuestionnaire;
    const createdDuplicateIds = [];

    beforeEach(async () => {
      queriedQuestionnaire = await queryQuestionnaire(ctx);
    });

    afterEach(async () => {
      for (const id of createdDuplicateIds) {
        const dbCopy = await getQuestionnaire(id);
        if (dbCopy) {
          const cleanupCtx = {
            questionnaire: dbCopy,
            user: ctx.user,
            validationErrorInfo: validateQuestionnaire(dbCopy),
          };
          await deleteQuestionnaire(cleanupCtx, id);
        }
      }
      createdDuplicateIds.length = 0;
      jest.clearAllMocks();
    });

    it("should use supplied title and shortTitle when both are provided", async () => {
      const result = await duplicateQuestionnaire(ctx, {
        title: "My Title",
        shortTitle: "my-short",
      });
      createdDuplicateIds.push(result.id);
      expect(result.title).toEqual("My Title");
      expect(result.shortTitle).toEqual("my-short");
    });


    it("should throw when supplied title is an empty string", async () => {
      await expect(
        duplicateQuestionnaire(ctx, { title: "" })
      ).rejects.toThrow("title must be a non-empty string.");
    });

    it("should throw when supplied title is whitespace only", async () => {
      await expect(
        duplicateQuestionnaire(ctx, { title: "   " })
      ).rejects.toThrow("title must be a non-empty string.");
    });

    it("should reject when supplied title is not a string", async () => {
      await expect(
        duplicateQuestionnaire(ctx, { title: 123 })
      ).rejects.toThrow("Expected type String");
    });

    it("should apply default prefix to shortTitle when only title is supplied", async () => {
      const result = await duplicateQuestionnaire(ctx, { title: "Only Title" });
      createdDuplicateIds.push(result.id);
      expect(result.title).toEqual("Only Title");
      expect(result.shortTitle).toEqual(`Copy of ${queriedQuestionnaire.shortTitle}`);
    });

    it("should apply default prefix to title when only shortTitle is supplied", async () => {
      const result = await duplicateQuestionnaire(ctx, { shortTitle: "only-short" });
      createdDuplicateIds.push(result.id);
      expect(result.title).toEqual(`Copy of ${queriedQuestionnaire.title}`);
      expect(result.shortTitle).toEqual("only-short");
    });

    it("should succeed when shortTitle is supplied as an empty string", async () => {
      const result = await duplicateQuestionnaire(ctx, { shortTitle: "" });
      createdDuplicateIds.push(result.id);
      expect(result.shortTitle).toEqual("");
    });

    it("should treat explicit null title as omitted and apply default prefix", async () => {
      const result = await duplicateQuestionnaire(ctx, { title: null });
      createdDuplicateIds.push(result.id);
      expect(result.title).toEqual(`Copy of ${queriedQuestionnaire.title}`);
    });

    it("should treat explicit null shortTitle as omitted and apply default prefix", async () => {
      const result = await duplicateQuestionnaire(ctx, { shortTitle: null });
      createdDuplicateIds.push(result.id);
      expect(result.shortTitle).toEqual(`Copy of ${queriedQuestionnaire.shortTitle}`);
    });

    it("should return the duplicate with the correct title without a separate update call", async () => {
      const result = await duplicateQuestionnaire(ctx, { title: "Final Title" });
      createdDuplicateIds.push(result.id);
      // The returned questionnaire already has the correct title — no second call required
      expect(result.title).toEqual("Final Title");
      const dbRecord = await getQuestionnaire(result.id);
      expect(dbRecord.title).toEqual("Final Title");
    });

    it("should reject duplication when the caller is unauthenticated", async () => {
      const unauthCtx = { ...ctx, user: null };
      await expect(
        duplicateQuestionnaire(unauthCtx, { title: "Should Not Be Created" })
      ).rejects.toThrow();
    });

    it("should reject duplication without custom naming when the caller is unauthenticated", async () => {
      const unauthCtx = { ...ctx, user: null };
      await expect(duplicateQuestionnaire(unauthCtx)).rejects.toThrow();
    });

    it("should log source and new questionnaire IDs on successful duplication", async () => {
      const infoSpy = jest.spyOn(logger, "info");

      const result = await duplicateQuestionnaire(ctx, { title: "Logged Title" });
      createdDuplicateIds.push(result.id);

      expect(infoSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceQid: ctx.questionnaire.id,
          newQid: result.id,
          customTitle: true,
          customShortTitle: false,
        }),
        expect.stringContaining("Duplicated questionnaire")
      );

      infoSpy.mockRestore();
    });

    it("should log the source questionnaire ID when duplication fails and re-throw the error", async () => {
      const { createQuestionnaire: mockCreate } = require("../../db/datastore");
      const dbError = new Error("Simulated DB failure");
      mockCreate.mockRejectedValueOnce(dbError);

      const errorSpy = jest.spyOn(logger, "error");

      await expect(
        duplicateQuestionnaire(ctx, { title: "Will Fail" })
      ).rejects.toThrow("Simulated DB failure");

      expect(errorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sourceQid: ctx.questionnaire.id,
          customTitle: true,
          customShortTitle: false,
        }),
        expect.stringContaining("Failed to duplicate questionnaire")
      );

      errorSpy.mockRestore();
    });
  });
});
