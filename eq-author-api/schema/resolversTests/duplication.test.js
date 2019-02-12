const { first, omit } = require("lodash");
const {
  createQuestionnaire,
  deleteQuestionnaire,
  duplicateQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");

const {
  createSection,
  deleteSection,
  duplicateSection,
} = require("../../tests/utils/questionnaireBuilder/section");

const {
  createQuestionPage,
  deleteQuestionPage,
  duplicatePage,
} = require("../../tests/utils/questionnaireBuilder/page");

describe("duplication", () => {
  let questionnaire;

  beforeEach(async () => {
    questionnaire = await createQuestionnaire();
  });

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("duplicate a page", async () => {
    let page;
    let pageCopy;

    beforeEach(async () => {
      page = await createQuestionPage(
        questionnaire,
        first(questionnaire.sections).id
      );
      pageCopy = await duplicatePage(questionnaire, page);
    });

    afterEach(async () => {
      await deleteQuestionPage(questionnaire, page);
      await deleteQuestionPage(questionnaire, pageCopy);
    });

    it("should copy page with answers and question confirmation", async () => {
      expect(pageCopy).toEqual(
        expect.objectContaining(omit(page, ["id", "title", "position"]))
      );
    });

    it("should have new id", async () => {
      expect(pageCopy.id).not.toEqual(page.id);
    });

    it("should create new title", async () => {
      expect(pageCopy.title).toEqual(`Copy of ${page.title}`);
    });

    it("should correctly increment position", async () => {
      expect(pageCopy.position).toEqual(page.position + 1);
    });
  });

  describe("duplicate a section", async () => {
    let section;
    let sectionCopy;

    beforeEach(async () => {
      section = await createSection(questionnaire);
      sectionCopy = await duplicateSection(questionnaire, section);
    });

    afterEach(async () => {
      await deleteSection(questionnaire, section);
      await deleteSection(questionnaire, sectionCopy);
    });

    it("should copy section with pages", async () => {
      expect(sectionCopy).toEqual(
        expect.objectContaining(omit(section, ["id", "title", "position"]))
      );
    });

    it("should have new id", async () => {
      expect(sectionCopy.id).not.toEqual(section.id);
    });

    it("should create new title", async () => {
      expect(sectionCopy.title).toEqual(`Copy of ${section.title}`);
    });

    it("should correctly increment position", async () => {
      expect(sectionCopy.position).toEqual(section.position + 1);
    });
  });

  describe("duplicate a questionnaire", async () => {
    let questionnaireCopy;

    beforeEach(async () => {
      questionnaireCopy = await duplicateQuestionnaire(questionnaire);
    });

    afterEach(async () => {
      await deleteQuestionnaire(questionnaireCopy.id);
    });

    it("should copy questionnaire with sections and pages", async () => {
      expect(questionnaireCopy).toEqual(
        expect.objectContaining(omit(questionnaire, ["id", "title"]))
      );
    });

    it("should have new id", async () => {
      expect(questionnaireCopy.id).not.toEqual(questionnaire.id);
    });

    it("should create new title", async () => {
      expect(questionnaireCopy.title).toEqual(`Copy of ${questionnaire.title}`);
    });
  });
});
