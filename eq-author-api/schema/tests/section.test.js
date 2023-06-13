const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

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

const {
  updateQuestionnaireIntroduction,
} = require("../../tests/utils/contextBuilder/questionnaireIntroduction");

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
      ctx.comments = {};
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
        position: 1,
      });
      const { sections } = await queryQuestionnaire(ctx);
      expect(sections.map((s) => s.id)).toEqual([
        secondSectionId,
        sectionToMoveId,
      ]);
    });

    it("should be able to move a section earlier", async () => {
      const firstSectionId = questionnaire.sections[0].id;
      const sectionToMoveId = questionnaire.sections[1].id;

      await moveSection(ctx, {
        id: sectionToMoveId,
        position: 0,
      });
      const { sections } = await queryQuestionnaire(ctx);
      expect(sections.map((s) => s.id)).toEqual([
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
      });
    });

    it("should resolve title string if navigation is off", async () => {
      ctx.questionnaire.sections[1].title = "Test title";
      queriedSection = await querySection(ctx, questionnaire.sections[1].id);
      expect(queriedSection).toMatchObject({
        title: "Test title",
        displayName: "Alias",
      });
      ctx.questionnaire.sections[1].title = "Test title";
      ctx.questionnaire.navigation = false;
      queriedSection = await querySection(ctx, questionnaire.sections[1].id);
      expect(queriedSection).toMatchObject({
        title: "Test title",
        displayName: "Alias",
      });
    });

    it("should resolve questionnaire", () => {
      expect(queriedSection.questionnaire.id).toEqual(questionnaire.id);
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
        ctx.comments = {};
      });

      it("should not validate the section title if Hub is off and preview questions is off", async () => {
        ctx = await buildContext({
          sections: [
            {
              title: "",
            },
          ],
          introduction: {
            previewQuestions: false,
          },
          hub: false,
        });

        questionnaire = ctx.questionnaire;
        const section = questionnaire.sections[0];

        const queriedSection = await querySection(ctx, section.id);
        expect(queriedSection.validationErrorInfo).toMatchObject({
          totalCount: 0,
        });
        expect(queriedSection.validationErrorInfo.errors).toHaveLength(0);
      });

      it("should validate the section title if Hub is off and preview questions is on", async () => {
        ctx = await buildContext({
          sections: [
            {
              title: "",
            },
          ],
          hub: false,
        });

        questionnaire = ctx.questionnaire;
        const section = questionnaire.sections[0];

        const queriedSection = await querySection(ctx, section.id);
        expect(queriedSection.validationErrorInfo).toMatchObject({
          totalCount: 1,
        });
        expect(queriedSection.validationErrorInfo.errors).toHaveLength(1);
      });

      describe("Section introduction", () => {
        it("should be valid if introduction is not enabled and introduction title, introduction content and page description are not populated", async () => {
          const update = {
            id: section.id,
            title: section.title,
            introductionEnabled: false,
            introductionTitle: "",
            introductionContent: "",
            introductionPageDescription: "",
          };
          await updateQuestionnaireIntroduction(ctx, {
            previewQuestions: false,
          });
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 0,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(0);
        });

        it("should be valid if introduction title, introduction content and page description are populated", async () => {
          const update = {
            id: section.id,
            title: section.title,
            introductionEnabled: true,
            introductionTitle: "introduction title",
            introductionContent: "introduction content",
            introductionPageDescription: "introduction description",
          };
          await updateQuestionnaireIntroduction(ctx, {
            previewQuestions: false,
          });
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 0,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(0);
        });

        it("should be invalid if introduction title and page description populated but introduction content is empty", async () => {
          const update = {
            id: section.id,
            title: section.title,
            introductionEnabled: true,
            introductionTitle: "introduction title",
            introductionContent: "",
            introductionPageDescription: "introduction description",
          };
          await updateQuestionnaireIntroduction(ctx, {
            previewQuestions: false,
          });
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 1,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(1);
        });

        it("should be invalid if introduction content and page description populated but introduction title is empty", async () => {
          const update = {
            id: section.id,
            title: section.title,
            introductionEnabled: true,
            introductionTitle: "",
            introductionContent: "introduction content",
            introductionPageDescription: "introduction description",
          };
          await updateQuestionnaireIntroduction(ctx, {
            previewQuestions: false,
          });
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 1,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(1);
        });

        it("should be invalid if introduction title and introduction content populated but page description is empty", async () => {
          const update = {
            id: section.id,
            title: section.title,
            introductionEnabled: true,
            introductionTitle: "introduction title",
            introductionContent: "introduction content",
            introductionPageDescription: "",
          };
          await updateQuestionnaireIntroduction(ctx, {
            previewQuestions: false,
          });
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 1,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(1);
        });
      });

      describe("Section summary", () => {
        it("should be valid if section summary is not enabled when section title and summary page description are empty", async () => {
          const update = {
            id: section.id,
            title: "",
            sectionSummary: false,
            sectionSummaryPageDescription: "",
          };
          await updateQuestionnaireIntroduction(ctx, {
            previewQuestions: false,
          });
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 0,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(0);
        });

        it("should be valid if section summary is enabled when section title and summary page description are not empty", async () => {
          const update = {
            id: section.id,
            title: "section title",
            sectionSummary: true,
            sectionSummaryPageDescription: "summary description",
          };
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 0,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(0);
        });

        it("should be invalid if section summary is enabled and summary page description is empty", async () => {
          const update = {
            id: section.id,
            title: "section title",
            sectionSummary: true,
            sectionSummaryPageDescription: "",
          };
          const updatedSection = await updateSection(ctx, update);

          expect(updatedSection.validationErrorInfo).toMatchObject({
            totalCount: 1,
            errors: expect.any(Array),
          });
          expect(updatedSection.validationErrorInfo.errors).toHaveLength(1);
        });

        it("should be invalid if section summary is enabled and section title is empty", async () => {
          const update = {
            id: section.id,
            title: "",
            sectionSummary: true,
            sectionSummaryPageDescription: "section summary description",
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

    describe("comments", () => {
      beforeEach(async () => {
        ctx = await buildContext({
          sections: [{}, {}],
        });
        questionnaire = ctx.questionnaire;
      });

      it("should retrieve comments from context", async () => {
        const section = questionnaire.sections[0];

        const update = {
          id: section.id,
          title: section.title,
          introductionTitle: "",
          introductionContent: "",
        };
        ctx.comments = {};

        ctx.comments[section.id] = [
          {
            id: "comment-1",
            commentText: "Test comment 1",
          },
          {
            id: "comment-2",
            commentText: "Test comment 2",
          },
        ];

        const updatedSection = await updateSection(ctx, update);

        expect(updatedSection.comments).toEqual(
          expect.arrayContaining(ctx.comments[section.id])
        );
      });
    });
  });
});
