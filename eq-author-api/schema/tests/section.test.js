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
      ctx = await buildContext({ navigation: true });
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
                folders
              }
            `,
            {
              title: "Title",
              alias: "Alias",
              folders: [expect.any(Object)],
            }
          )
        )
      );
    });
  });

  describe("mutate", () => {
    beforeAll(async () => {
      ctx = await buildContext({
        navigation: true,
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
        navigation: true,
        metadata: [{}],
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [{ type: NUMBER }],
                  },
                ],
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
        folders: expect.any(Array),
        questionnaire: expect.any(Object),
        availablePipingAnswers: expect.any(Array),
        availablePipingMetadata: expect.any(Array),
      });
    });

    it("should resolve title to empty string if navigation is off", async () => {
      ctx.questionnaire.sections[1].title = "Test title";
      queriedSection = await querySection(ctx, questionnaire.sections[1].id);
      expect(queriedSection).toMatchObject({
        title: "Test title",
        displayName: "Alias",
      });
      ctx.questionnaire.navigation = false;
      queriedSection = await querySection(ctx, questionnaire.sections[1].id);
      expect(queriedSection).toMatchObject({
        title: "",
        displayName: "Alias",
      });
    });

    it("should resolve questionnaire", () => {
      expect(queriedSection.questionnaire.id).toEqual(questionnaire.id);
    });

    it("should resolve availablePipingAnswers", () => {
      expect(last(queriedSection.availablePipingAnswers).id).toEqual(
        get(questionnaire, "sections[0].folders[0].pages[0].answers[0].id")
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

  describe("author validation", () => {
    it("should validate the section and return the errors", async () => {
      ctx = await buildContext({
        sections: [
          {
            title: "",
          },
        ],
        navigation: true,
      });

      questionnaire = ctx.questionnaire;
      const section = questionnaire.sections[0];

      const queriedSection = await querySection(ctx, section.id);

      expect(queriedSection.validationErrorInfo).toMatchObject({
        totalCount: 1,
        errors: expect.any(Array),
      });
      expect(queriedSection.validationErrorInfo.errors).toHaveLength(1);
    });

    describe("section page", () => {
      let section;

      beforeEach(async () => {
        ctx = await buildContext({
          sections: [
            {
              title: "",
            },
          ],
        });

        questionnaire = ctx.questionnaire;
        section = questionnaire.sections[0];
      });

      it("should be valid if neither introduction title nor introduction content are populated", async () => {
        const update = {
          id: section.id,
          title: section.title,
          introductionTitle: "",
          introductionContent: "",
        };
        const updatedSection = await updateSection(ctx, update);

        expect(updatedSection.validationErrorInfo).toMatchObject({
          totalCount: 0,
          errors: expect.any(Array),
        });
        expect(updatedSection.validationErrorInfo.errors).toHaveLength(0);
      });

      it("should be valid if both introduction title and introduction content are populated", async () => {
        const update = {
          id: section.id,
          title: section.title,
          introductionTitle: "introduction title",
          introductionContent: "introduction content",
        };
        const updatedSection = await updateSection(ctx, update);

        expect(updatedSection.validationErrorInfo).toMatchObject({
          totalCount: 0,
          errors: expect.any(Array),
        });
        expect(updatedSection.validationErrorInfo.errors).toHaveLength(0);
      });

      it("should be invalid if introduction title populated but introduction content is empty", async () => {
        const update = {
          id: section.id,
          title: section.title,
          introductionTitle: "introduction title",
          introductionContent: "",
        };
        const updatedSection = await updateSection(ctx, update);

        expect(updatedSection.validationErrorInfo).toMatchObject({
          totalCount: 1,
          errors: expect.any(Array),
        });
        expect(updatedSection.validationErrorInfo.errors).toHaveLength(1);
      });

      it("should be invalid if introduction content populated but introduction title is empty", async () => {
        const update = {
          id: section.id,
          title: section.title,
          introductionTitle: "",
          introductionContent: "introduction content",
        };
        const updatedSection = await updateSection(ctx, update);

        expect(updatedSection.validationErrorInfo).toMatchObject({
          totalCount: 1,
          errors: expect.any(Array),
        });
        expect(updatedSection.validationErrorInfo.errors).toHaveLength(1);
      });
    });
  });
});
