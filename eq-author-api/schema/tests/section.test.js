const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const { get, last } = require("lodash");

const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  deleteQuestionnaire,
  queryQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  createSection,
  updateSection,
  querySection,
  deleteSection,
  moveSection,
} = require("../../tests/utils/contextBuilder/section");

const { NUMBER } = require("../../constants/answerTypes");

describe("section", () => {
  let ctx, questionnaire;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("create", () => {
    beforeAll(async () => {
      ctx = await buildContext({});
      questionnaire = ctx.questionnaire;
    });

    it("should create a section", async () => {
      const createdSection = await createSection(ctx, {
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
                introductionTitle
                introductionContent
                pages
              }
            `,
            {
              title: "Title",
              alias: "Alias",
              pages: [expect.any(Object)],
            }
          )
        )
      );
    });
  });

  describe("mutate", () => {
    beforeAll(async () => {
      ctx = await buildContext({
        sections: [{}],
      });
      questionnaire = ctx.questionnaire;
    });

    it("should mutate a section", async () => {
      const section = questionnaire.sections[0];
      const update = {
        id: section.id,
        title: "Questionnaire-updated",
        alias: "Alias-updated",
        introductionTitle: "Questionnaire-updated-title",
        introductionContent: "Alias-updated-content",
      };
      const updatedSection = await updateSection(ctx, update);
      expect(updatedSection).toEqual(expect.objectContaining(update));
    });
  });

  describe("move", () => {
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [{}, {}],
      });
      questionnaire = ctx.questionnaire;
    });

    it("should be able to move a section later", async () => {
      const sectionToMoveId = questionnaire.sections[0].id;
      const secondSectionId = questionnaire.sections[1].id;

      await moveSection(ctx, {
        id: sectionToMoveId,
        questionnaireId: questionnaire.id,
        position: 1,
      });
      const { sections } = await queryQuestionnaire(ctx);
      expect(sections.map(s => s.id)).toEqual([
        secondSectionId,
        sectionToMoveId,
      ]);
    });

    it("should be able to move a section earlier", async () => {
      const firstSectionId = questionnaire.sections[0].id;
      const sectionToMoveId = questionnaire.sections[1].id;

      await moveSection(ctx, {
        id: sectionToMoveId,
        questionnaireId: questionnaire.id,
        position: 0,
      });
      const { sections } = await queryQuestionnaire(ctx);
      expect(sections.map(s => s.id)).toEqual([
        sectionToMoveId,
        firstSectionId,
      ]);
    });
  });

  describe("query", () => {
    let queriedSection;

    beforeEach(async () => {
      ctx = await buildContext({
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
      questionnaire = ctx.questionnaire;
      queriedSection = await querySection(ctx, questionnaire.sections[1].id);
    });

    it("should resolve section fields", () => {
      expect(queriedSection).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        alias: expect.any(String),
        displayName: expect.any(String),
        pages: expect.any(Array),
        questionnaire: expect.any(Object),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
      });
    });

    it("should resolve questionnaire", () => {
      expect(queriedSection.questionnaire.id).toEqual(questionnaire.id);
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
      ctx = await buildContext({
        sections: [{}],
      });
      questionnaire = ctx.questionnaire;
      const section = questionnaire.sections[0];
      await deleteSection(ctx, section.id);
      const deletedSection = await querySection(ctx, section.id);
      expect(deletedSection).toBeNull();
    });
  });
});
