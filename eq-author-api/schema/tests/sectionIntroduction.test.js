const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  updateSectionIntroduction,
  querySectionIntroduction,
  deleteSectionIntroduction,
} = require("../../tests/utils/questionnaireBuilder/sectionIntroduction");

describe("sectionIntroduction", () => {
  let questionnaire, section;
  let config = {
    sections: [
      {
        introduction: {
          introductionTitle: "intro-title-1",
          introductionContent: "intro-content-1",
        },
      },
    ],
  };

  beforeAll(async () => {
    questionnaire = await buildQuestionnaire(config);
    section = last(questionnaire.sections);
  });

  afterAll(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    it("should create and enable section introduction", () => {
      expect(section).toEqual(
        expect.objectContaining({
          introductionEnabled: true,
        })
      );
    });

    it("should set title and content to null", () => {
      expect(section).toEqual(
        expect.objectContaining({
          introductionTitle: null,
          introductionContent: null,
        })
      );
    });
  });

  describe("mutate", () => {
    let updatedSectionIntroduction;
    let update;
    beforeEach(async () => {
      update = {
        sectionId: section.id,
        introductionTitle: "intro-title-updated",
        introductionContent: "intro-content-updated",
      };
      updatedSectionIntroduction = await updateSectionIntroduction(
        questionnaire,
        update
      );
    });

    it("should mutate a sectionIntroduction", () => {
      const fields = gql`
        {
          introductionTitle
          introductionContent
        }
      `;
      expect(filter(fields, updatedSectionIntroduction)).toEqual(
        expect.objectContaining(filter(fields, update))
      );
    });
  });

  describe("query", () => {
    let queriedSectionIntroduction;

    beforeEach(async () => {
      queriedSectionIntroduction = await querySectionIntroduction(
        questionnaire,
        section.id
      );
    });

    it("should resolve sectionIntroduction fields", () => {
      expect(queriedSectionIntroduction).toMatchObject({
        id: expect.any(String),
        introductionTitle: expect.any(String),
        introductionContent: expect.any(String),
        section: expect.any(Object),
      });
    });

    it("should resolve section", () => {
      expect(queriedSectionIntroduction.section.id).toEqual(section.id);
    });
  });

  describe("delete", () => {
    it("should delete a section introduction", async () => {
      await deleteSectionIntroduction(questionnaire, section.id);
      const deletedSectionIntroduction = await querySectionIntroduction(
        questionnaire,
        section.id
      );
      expect(deletedSectionIntroduction).toBeNull();
    });
  });
});
