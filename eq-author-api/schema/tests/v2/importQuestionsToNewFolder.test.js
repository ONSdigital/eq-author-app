const { buildContext } = require("../../../tests/utils/contextBuilder");
const { getPages } = require("../../resolvers/utils");
const {
  importQuestionsToNewFolder,
} = require("../../../tests/utils/v2/contextBuilder/importing");
const {
  updateAnswer,
} = require("../../../tests/utils/contextBuilder/answer/updateAnswer");

describe("Importing questions to new folder", () => {
  describe("Error conditions", () => {
    const defaultInput = {
      questionnaireId: "questionnaire-id",
      questionIds: ["question-1", "question-2", "question-3"],
      position: {
        index: 0,
        sectionId: "section-1",
      },
    };

    it("should throw if sectionId is not provided", async () => {
      expect(
        importQuestionsToNewFolder(await buildContext({}), {
          ...defaultInput,
          position: { index: 0, sectionId: null },
        })
      ).rejects.toThrow("Target section ID must be provided");
    });

    it("should throw if source questionnaireId doesn't exist", async () => {
      expect(
        importQuestionsToNewFolder(await buildContext({}), defaultInput)
      ).rejects.toThrow(
        "Questionnaire with ID questionnaire-id does not exist."
      );
    });

    it("should throw if not all questions present in source questionnaire", async () => {
      const { questionnaire: sourceQuestionnaire } = await buildContext({});
      const ctx = await buildContext({});

      expect(
        importQuestionsToNewFolder(ctx, {
          ...defaultInput,
          questionnaireId: sourceQuestionnaire.id,
        })
      ).rejects.toThrow(
        `Not all page IDs in [${defaultInput.questionIds}] exist in source questionnaire ${sourceQuestionnaire.id}.`
      );
    });

    it("should throw if target section doesn't exist", async () => {
      const { questionnaire: sourceQuestionnaire } = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });
      const ctx = await buildContext({});
      const questionIds = getPages({ questionnaire: sourceQuestionnaire }).map(
        ({ id }) => id
      );

      expect(
        importQuestionsToNewFolder(ctx, {
          questionnaireId: sourceQuestionnaire.id,
          questionIds,
          position: {
            index: 0,
            sectionId: "missing-section-id",
          },
        })
      ).rejects.toThrow(
        "Section with ID missing-section-id doesn't exist in target questionnaire."
      );
    });
  });

  describe("Success conditions", () => {
    const setup = async (
      sourceQuestionnaireStructure = {
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      }
    ) => {
      const { questionnaire: sourceQuestionnaire } = await buildContext(
        sourceQuestionnaireStructure
      );
      const questionIds = getPages({ questionnaire: sourceQuestionnaire }).map(
        ({ id }) => id
      );
      const ctx = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });

      return { ctx, questionIds, sourceQuestionnaire };
    };

    it("should import questions into a single new folder", async () => {
      const { ctx, questionIds, sourceQuestionnaire } = await setup();
      const targetSection = ctx.questionnaire.sections[0];

      expect(targetSection.folders).toHaveLength(1);

      await importQuestionsToNewFolder(ctx, {
        questionnaireId: sourceQuestionnaire.id,
        questionIds,
        position: {
          index: 0,
          sectionId: targetSection.id,
        },
      });

      expect(targetSection.folders).toHaveLength(2);
      expect(targetSection.folders[0].pages).toHaveLength(2);
      expect(targetSection.folders[0].pages[0]).toMatchObject({
        ...sourceQuestionnaire.sections[0].folders[0].pages[0],
        id: expect.any(String),
      });
      expect(targetSection.folders[0].pages[1]).toMatchObject({
        ...sourceQuestionnaire.sections[0].folders[0].pages[1],
        id: expect.any(String),
      });
    });

    it("should remove qCodes and re-map IDs from imported content", async () => {
      const { ctx, questionIds, sourceQuestionnaire } = await setup({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: "Number",
                        qCode: "qcode1",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });

      const targetSection = ctx.questionnaire.sections[0];

      await importQuestionsToNewFolder(ctx, {
        questionnaireId: sourceQuestionnaire.id,
        questionIds,
        position: {
          index: 0,
          sectionId: targetSection.id,
        },
      });

      const importedPage = targetSection.folders[0].pages[0];
      const sourcePage = sourceQuestionnaire.sections[0].folders[0].pages[0];

      expect(importedPage).toMatchObject({
        id: expect.any(String),
        answers: [
          {
            id: expect.any(String),
            type: "Number",
            qCode: null,
            questionPageId: importedPage.id,
          },
        ],
      });

      expect(importedPage.id).not.toBe(sourcePage.id);
      expect(importedPage.answers[0].id).not.toBe(sourcePage.answers[0].id);
    });

    it("should clear repeatingLabelAndInputListId when importing", async () => {
      const sourceQuestionnaireStructure = {
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        label: "Answer 1",
                        repeatingLabelAndInput: true,
                        type: "TextField",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const sourceCtx = await buildContext(sourceQuestionnaireStructure);
      const { questionnaire: sourceQuestionnaire } = sourceCtx;

      const sourcePage = sourceQuestionnaire.sections[0].folders[0].pages[0];
      await updateAnswer(sourceCtx, {
        id: sourcePage.answers[0].id,
        repeatingLabelAndInput: true,
        repeatingLabelAndInputListId: "list-1",
      });

      const questionIds = getPages({ questionnaire: sourceQuestionnaire }).map(
        ({ id }) => id
      );

      const ctx = await buildContext({
        sections: [{ folders: [{ pages: [{}] }] }],
      });
      const targetSection = ctx.questionnaire.sections[0];

      await importQuestionsToNewFolder(ctx, {
        questionnaireId: sourceQuestionnaire.id,
        questionIds,
        position: {
          index: 0,
          sectionId: targetSection.id,
        },
      });

      expect(targetSection.folders[0].pages[0].answers[0]).toMatchObject({
        repeatingLabelAndInput: true,
        repeatingLabelAndInputListId: "",
      });
    });
  });
});
