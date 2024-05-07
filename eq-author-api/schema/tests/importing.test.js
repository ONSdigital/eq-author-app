const { buildContext } = require("../../tests/utils/contextBuilder");
const { getPages, getFolders, getSections } = require("../resolvers/utils");

const {
  importQuestions,
  importFolders,
  importSections,
} = require("../../tests/utils/contextBuilder/importing");
const {
  updateFolder,
} = require("../../tests/utils/contextBuilder/folder/updateFolder");

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

describe("Importing folders", () => {
  describe("Error conditions", () => {
    const defaultInput = {
      questionnaireId: "questionnaire-id",
      folderIds: ["folder-1", "folder-2", "folder-3"],
      position: {
        index: 0,
        sectionId: "section-1",
      },
    };

    it("should throw error if sectionId is not provided", async () => {
      expect(
        importFolders(await buildContext({}), {
          questionnaireId: "questionnaire-id",
          folderIds: ["folder-1", "folder-2", "folder-3"],
          position: {
            index: 0,
            sectionId: null,
          },
        })
      ).rejects.toThrow("Target section ID must be provided");
    });

    it("should throw error if source questionnaireID doesn't exist", async () => {
      expect(
        importFolders(await buildContext({}), defaultInput)
      ).rejects.toThrow(/Questionnaire with ID .+ does not exist/);
    });

    it("should throw error if not all folders are present in source questionnaire", async () => {
      const { questionnaire: sourceQuestionnaire } = await buildContext({});
      const ctx = await buildContext({});

      expect(
        importFolders(ctx, {
          ...defaultInput,
          questionnaireId: sourceQuestionnaire.id,
        })
      ).rejects.toThrow(/Not all folder IDs .+ exist in source questionnaire/);
    });

    it("should throw error if target section doesn't exist", async () => {
      const { questionnaire: sourceQuestionnaire } = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });
      const ctx = await buildContext({});
      const folderIds = getFolders({ questionnaire: sourceQuestionnaire }).map(
        ({ id }) => id
      );

      expect(
        importFolders(ctx, {
          questionnaireId: sourceQuestionnaire.id,
          folderIds,
          position: {
            index: 0,
            sectionId: "undefined-section",
          },
        })
      ).rejects.toThrow(
        /Section with ID .+ doesn't exist in target questionnaire/
      );
    });
  });

  describe("Success conditions", () => {
    const setup = async (
      sourceStructure = {
        sections: [
          {
            folders: [
              {
                pages: [{ title: "Page 1" }, { title: "Page 2" }],
              },
            ],
          },
        ],
      }
    ) => {
      const { questionnaire: sourceQuestionnaire } = await buildContext(
        sourceStructure
      );

      const folderIds = getFolders({ questionnaire: sourceQuestionnaire }).map(
        ({ id }) => id
      );

      const ctx = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });

      return { ctx, folderIds, sourceQuestionnaire };
    };

    it("should import folders into a section", async () => {
      const { ctx, folderIds, sourceQuestionnaire } = await setup();
      const destinationSection = ctx.questionnaire.sections[0];
      expect(destinationSection.folders).toHaveLength(1);

      await importFolders(ctx, {
        questionnaireId: sourceQuestionnaire.id,
        folderIds,
        position: {
          index: 0,
          sectionId: destinationSection.id,
        },
      });

      expect(destinationSection.folders).toHaveLength(2);
      expect(destinationSection.folders[0].pages[0]).toMatchObject({
        ...sourceQuestionnaire.sections[0].folders[0].pages[0],
        id: expect.any(String),
      });
      expect(destinationSection.folders[0].pages[1]).toMatchObject({
        ...sourceQuestionnaire.sections[0].folders[0].pages[1],
        id: expect.any(String),
      });
    });

    it("should remove qCodes from imported content", async () => {
      const { ctx, folderIds, sourceQuestionnaire } = await setup({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    answers: [
                      {
                        type: "Checkbox",
                        qCode: "answer-qCode",
                        options: [
                          {
                            qCode: "option-qCode",
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      const destinationSection = ctx.questionnaire.sections[0];

      await importFolders(ctx, {
        questionnaireId: sourceQuestionnaire.id,
        folderIds,
        position: {
          index: 0,
          sectionId: destinationSection.id,
        },
      });

      expect(destinationSection.folders[0].pages[0]).toMatchObject({
        ...sourceQuestionnaire.sections[0].folders[0].pages[0],
        id: expect.any(String),
        answers: [
          {
            ...sourceQuestionnaire.sections[0].folders[0].pages[0].answers[0],
            id: expect.any(String),
            qCode: null,
            questionPageId: destinationSection.folders[0].pages[0].id,
            options: [
              {
                ...sourceQuestionnaire.sections[0].folders[0].pages[0]
                  .answers[0].options[0],
                id: expect.any(String),
                qCode: null,
              },
            ],
          },
        ],
      });
    });

    it("should set folder listId to empty string when importing a folder with listId", async () => {
      const sourceStructure = {
        sections: [
          {
            folders: [
              {
                listId: "list-1",
                pages: [{ title: "Page 1" }, { title: "Page 2" }],
              },
            ],
          },
        ],
      };

      const { ctx } = await setup(sourceStructure);
      const destinationSection = ctx.questionnaire.sections[0];
      const sourceQuestionnaireCtx = await buildContext(sourceStructure);
      const { questionnaire: sourceQuestionnaire } = sourceQuestionnaireCtx;

      await updateFolder(sourceQuestionnaireCtx, {
        folderId: sourceQuestionnaire.sections[0].folders[0].id,
        listId: "list-1",
      });

      await importFolders(ctx, {
        questionnaireId: sourceQuestionnaire.id,
        folderIds: [sourceQuestionnaire.sections[0].folders[0].id],
        position: {
          index: 0,
          sectionId: destinationSection.id,
        },
      });

      expect(sourceQuestionnaire.sections[0].folders[0].listId).not.toEqual("");
      expect(sourceQuestionnaire.sections[0].folders[0].listId).toEqual(
        "list-1"
      );

      expect(destinationSection.folders[0]).toMatchObject({
        ...sourceQuestionnaire.sections[0].folders[0],
        id: expect.any(String),
        folderId: expect.any(String),
        listId: "",
        pages: [
          {
            ...sourceQuestionnaire.sections[0].folders[0].pages[0],
            id: expect.any(String),
          },
          {
            ...sourceQuestionnaire.sections[0].folders[0].pages[1],
            id: expect.any(String),
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

  describe("Success conditions", () => {
    const setup = async (
      sourceStructure = { sections: [{ folders: [{ pages: [{}, {}] }] }] }
    ) => {
      const { questionnaire: source } = await buildContext(sourceStructure);
      const sectionIds = getSections({ questionnaire: source }).map(
        ({ id }) => id
      );
      const ctx = await buildContext({
        sections: [{ folders: [{ pages: [{}, {}] }] }],
      });
      return { ctx, sectionIds, source };
    };

    it("should copy sections if section ID provided", async () => {
      const { ctx, sectionIds, source } = await setup();
      const section = ctx.questionnaire.sections[0];
      expect(ctx.questionnaire.sections).toHaveLength(1);
      await importSections(ctx, {
        questionnaireId: source.id,
        sectionIds,
        position: {
          index: 1,
          sectionId: section.id,
        },
      });
      expect(section.folders[0].pages[0]).toMatchObject({
        ...section.folders[0].pages[0],
        id: expect.any(String),
      });
      expect(ctx.questionnaire.sections[1].folders[0].pages[0]).toMatchObject({
        ...source.sections[0].folders[0].pages[0],
        id: expect.any(String),
      });
      expect(ctx.questionnaire.sections).toHaveLength(2);
    });
  });
});
