const { last, omit } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  queryQuestionnaire,
  deleteQuestionnaire,
  duplicateQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  querySection,
  deleteSection,
  duplicateSection,
} = require("../../tests/utils/questionnaireBuilder/section");

const {
  queryQuestionPage,
  deleteQuestionPage,
  duplicatePage,
} = require("../../tests/utils/questionnaireBuilder/page");

describe("Duplication", () => {
  let questionnaire, section;
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
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
  });

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("duplicate a page", async () => {
    let page, pageCopy;

    beforeEach(async () => {
      page = await queryQuestionPage(questionnaire, last(section.pages).id);
      let { id } = await duplicatePage(questionnaire, page);
      pageCopy = await queryQuestionPage(questionnaire, id);
    });

    afterEach(async () => {
      await deleteQuestionPage(questionnaire, pageCopy.id);
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

  describe("duplicate a section", async () => {
    let queriedSection;
    let sectionCopy;

    beforeEach(async () => {
      queriedSection = await querySection(questionnaire, section.id);
      let { id } = await duplicateSection(questionnaire, queriedSection);
      sectionCopy = await querySection(questionnaire, id);
    });

    afterEach(async () => {
      await deleteSection(questionnaire, sectionCopy.id);
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

  describe("duplicate a questionnaire", async () => {
    let queriedQuestionnaire;
    let questionnaireCopy;
    let duplicatedQuestionnaire;

    beforeEach(async () => {
      queriedQuestionnaire = await queryQuestionnaire(questionnaire);
      duplicatedQuestionnaire = await duplicateQuestionnaire(questionnaire);
      questionnaireCopy = await queryQuestionnaire(duplicatedQuestionnaire);
    });

    afterEach(async () => {
      await deleteQuestionnaire(questionnaireCopy.id);
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
