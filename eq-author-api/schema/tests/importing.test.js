const { buildContext } = require("../../tests/utils/contextBuilder");
const { getPages } = require("../resolvers/utils");
const {
  importQuestions,
  importSections,
} = require("../../tests/utils/contextBuilder/importing");

describe("Importing questions", () => {
  describe("Error conditions", () => {
    const defaultInput = {
      questionnaireId: "questionnaire-id",
      questionIds: ["q1", "q2", "q3"],
      position: {
        index: 0,
        sectionId: "section-1",
      },
    };

    it("should throw if neither sectionId or folderId provided", async () => {
      expect(
        importQuestions(await buildContext({}), {
          ...defaultInput,
          position: { index: 0, sectionId: null, folderId: null },
        })
      ).rejects.toThrow("Target folder or section ID must be provided");
    });

    it("should throw if source questionnaireID doesn't exist", async () => {
      expect(
        importQuestions(await buildContext({}), defaultInput)
      ).rejects.toThrow(/Questionnaire with ID .+ does not exist/);
    });

    it("should throw if not all questions present in source questionnaire", async () => {
      const { questionnaire: source } = await buildContext({});
      const ctx = await buildContext({});
      expect(
        importQuestions(ctx, {
          ...defaultInput,
          questionnaireId: source.id,
        })
      ).rejects.toThrow(/Not all page IDs .+ exist in source questionnaire/);
    });

    it("should throw if target folder or section doesn't exist", async () => {
      const { questionnaire: source } = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });
      const ctx = await buildContext({});
      const questionIds = getPages({ questionnaire: source }).map(
        ({ id }) => id
      );
      expect(
        importQuestions(ctx, {
          questionnaireId: source.id,
          questionIds,
          position: {
            index: 0,
            folderId: "nope",
          },
        })
      ).rejects.toThrow(
        /Folder with ID .+ doesn't exist in target questionnaire/
      );

      expect(
        importQuestions(ctx, {
          questionnaireId: source.id,
          questionIds,
          position: {
            index: 0,
            sectionId: "nope",
          },
        })
      ).rejects.toThrow(
        /Section with ID .+ doesn't exist in target questionnaire/
      );
    });
  });

  describe("Success conditions", () => {
    const setup = async (
      sourceStructure = { sections: [{ folders: [{ pages: [{}, {}] }] }] }
    ) => {
      const { questionnaire: source } = await buildContext(sourceStructure);
      const questionIds = getPages({ questionnaire: source }).map(
        ({ id }) => id
      );
      const ctx = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });
      return { ctx, questionIds, source };
    };

    it("should copy questions into new folders if section ID provided", async () => {
      const { ctx, questionIds, source } = await setup();
      expect(ctx.questionnaire.sections[0].folders).toHaveLength(1);
      await importQuestions(ctx, {
        questionnaireId: source.id,
        questionIds,
        position: {
          index: 0,
          sectionId: ctx.questionnaire.sections[0].id,
        },
      });
      expect(ctx.questionnaire.sections[0].folders).toHaveLength(3);
      expect(ctx.questionnaire.sections[0].folders[0].pages[0]).toMatchObject({
        ...source.sections[0].folders[0].pages[0],
        id: expect.any(String),
      });
      expect(ctx.questionnaire.sections[0].folders[1].pages[0]).toMatchObject({
        ...source.sections[0].folders[0].pages[1],
        id: expect.any(String),
      });
    });

    it("should copy questions into existing folder if folder ID provided", async () => {
      const { ctx, questionIds, source } = await setup();
      const targetFolder = ctx.questionnaire.sections[0].folders[0];
      expect(targetFolder.pages).toHaveLength(2);
      await importQuestions(ctx, {
        questionnaireId: source.id,
        questionIds,
        position: {
          index: 1,
          folderId: targetFolder.id,
        },
      });
      expect(targetFolder.pages).toHaveLength(4);
      expect(targetFolder.pages[1]).toMatchObject({
        ...source.sections[0].folders[0].pages[0],
        id: expect.any(String),
      });
      expect(targetFolder.pages[2]).toMatchObject({
        ...source.sections[0].folders[0].pages[1],
        id: expect.any(String),
      });
    });

    it("should remove qCodes and re-map IDs from imported content", async () => {
      const { ctx, questionIds, source } = await setup({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: "Checkbox",
                        qCode: "ans-qCode",
                        options: [{ qCode: "option-qCode" }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      const targetFolder = ctx.questionnaire.sections[0].folders[0];
      await importQuestions(ctx, {
        questionnaireId: source.id,
        questionIds,
        position: {
          index: 0,
          folderId: targetFolder.id,
        },
      });
      expect(targetFolder.pages[0]).toMatchObject({
        ...source.sections[0].folders[0].pages[0],
        id: expect.any(String),
        answers: [
          {
            ...source.sections[0].folders[0].pages[0].answers[0],
            id: expect.any(String),
            qCode: null,
            questionPageId: targetFolder.pages[0].id,
            options: [
              {
                ...source.sections[0].folders[0].pages[0].answers[0].options[0],
                id: expect.any(String),
                qCode: null,
              },
            ],
          },
        ],
      });
    });
  });
});

describe("Importing sections", () => {
  describe("Error conditions", () => {
    const defaultInput = {
      questionnaireId: "questionnaire-id",
      sectionIds: ["s1", "s2", "s3"],
      position: {
        index: 0,
        sectionId: "s0",
      },
    };

    it("should throw error if sectionId is not provided", async () => {
      expect(
        importSections(await buildContext({}), {
          ...defaultInput,
          position: { index: 0, sectionId: null },
        })
      ).rejects.toThrow("Target section ID must be provided");
    });

    it("should throw error if source questionnaireID doesn't exist", async () => {
      expect(
        importSections(await buildContext({}), defaultInput)
      ).rejects.toThrow(/Questionnaire with ID .+ does not exist/);
    });

    it("should throw error if not all sections present in source questionnaire", async () => {
      const { questionnaire: source } = await buildContext({});
      const ctx = await buildContext({});
      expect(
        importSections(ctx, {
          ...defaultInput,
          questionnaireId: source.id,
        })
      ).rejects.toThrow(/Not all section IDs .+ exist in source questionnaire/);
    });
  });
});
