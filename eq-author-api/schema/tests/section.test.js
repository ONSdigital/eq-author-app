const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { get, last } = require("lodash");

const {
  buildQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder");

const {
  deleteQuestionnaire,
  queryQuestionnaire,
} = require("../../tests/utils/questionnaireBuilder/questionnaire");
const {
  createSection,
  updateSection,
  querySection,
  deleteSection,
  moveSection,
} = require("../../tests/utils/questionnaireBuilder/section");

const { NUMBER } = require("../../constants/answerTypes");

describe("section", () => {
  let questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(questionnaire.id);
  });

  describe("create", () => {
    beforeAll(async () => {
      questionnaire = await buildQuestionnaire({});
    });

    it("should create a section", async () => {
      const createdSection = await createSection(questionnaire, {
        title: "Title",
        alias: "Alias",
        questionnaireId: questionnaire.id,
      });
      expect(createdSection).toEqual(
        expect.objectContaining(
          filter(
            gql`
              {
                title
                alias
                pages
              }
            `,
            { title: "Title", alias: "Alias", pages: [expect.any(Object)] }
          )
        )
      );
    });
  });

  describe("mutate", () => {
    beforeAll(async () => {
      questionnaire = await buildQuestionnaire({
        sections: [{}],
      });
    });

    it("should mutate a section", async () => {
      const section = questionnaire.sections[0];
      const update = {
        id: section.id,
        title: "Questionnaire-updated",
        alias: "Alias-updated",
      };
      const updatedSection = await updateSection(questionnaire, update);
      expect(updatedSection).toEqual(expect.objectContaining(update));
    });
  });

  describe("move", () => {
    beforeEach(async () => {
      questionnaire = await buildQuestionnaire({
        sections: [{}, {}],
      });
    });

    it("should be able to move a section later", async () => {
      const sectionToMoveId = questionnaire.sections[0].id;
      const secondSectionId = questionnaire.sections[1].id;

      await moveSection(questionnaire, {
        id: sectionToMoveId,
        questionnaireId: questionnaire.id,
        position: 1,
      });
      const { sections } = await queryQuestionnaire(questionnaire);
      expect(sections.map(s => s.id)).toEqual([
        secondSectionId,
        sectionToMoveId,
      ]);
    });

    it("should be able to move a section earlier", async () => {
      const firstSectionId = questionnaire.sections[0].id;
      const sectionToMoveId = questionnaire.sections[1].id;

      await moveSection(questionnaire, {
        id: sectionToMoveId,
        questionnaireId: questionnaire.id,
        position: 0,
      });
      const { sections } = await queryQuestionnaire(questionnaire);
      expect(sections.map(s => s.id)).toEqual([
        sectionToMoveId,
        firstSectionId,
      ]);
    });
  });

  describe("query", () => {
    let queriedSection;

    beforeAll(async () => {
      questionnaire = await buildQuestionnaire({
        metadata: [{}],
        sections: [
          {
            pages: [
              {
                answers: [{ type: NUMBER }],
              },
            ],
          },
          {
            alias: "Alias",
            introduction: {},
          },
        ],
      });
    });

    beforeEach(async () => {
      queriedSection = await querySection(
        questionnaire,
        questionnaire.sections[1].id
      );
    });

    it("should resolve section fields", () => {
      expect(queriedSection).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        alias: expect.any(String),
        displayName: expect.any(String),
        pages: expect.any(Array),
        questionnaire: expect.any(Object),
        introduction: expect.any(Object),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
      });
    });

    it("should resolve questionnaire", () => {
      expect(queriedSection.questionnaire.id).toEqual(questionnaire.id);
    });

    it("should resolve introduction", () => {
      expect(queriedSection.introduction.id).toEqual(queriedSection.id);
    });

    it("should resolve availablePipingAnswers", () => {
      expect(last(queriedSection.availablePipingAnswers).id).toEqual(
        get(questionnaire, "sections[0].pages[0].answers[0].id")
      );
    });

    it("should resolve availablePipingMetadata", () => {
      expect(last(queriedSection.availablePipingMetadata).id).toEqual(
        questionnaire.metadata[0].id
      );
    });
  });

  describe("delete", () => {
    it("should delete a section", async () => {
      questionnaire = await buildQuestionnaire({
        sections: [{}],
      });
      const section = questionnaire.sections[0];
      await deleteSection(questionnaire, section.id);
      const deletedSection = await querySection(questionnaire, section.id);
      expect(deletedSection).toBeNull();
    });
  });
});
