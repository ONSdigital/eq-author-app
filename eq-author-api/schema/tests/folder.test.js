const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  getFolders,
  getFolderById,
  getFolderByPageId,
} = require("../resolvers/utils");

const {
  createFolder,
  moveFolder,
  updateFolder,
  createListCollectorFolder,
} = require("../../tests/utils/contextBuilder/folder");

const {
  createList,
  deleteList,
} = require("../../tests/utils/contextBuilder/list");

const { createSection } = require("../../tests/utils/contextBuilder/section");

const folderProperties = ["id", "alias", "pages", "skipConditions"];

describe("Folders", () => {
  let ctx = {};
  let config = {};
  let questionnaire = {};
  beforeEach(async () => {
    ctx = await buildContext(null);
    config = {
      title: "Ratchet and Clank",
      description: "A survey about an amazing game",
      surveyId: "015",
      theme: "business",
      navigation: false,
      summary: false,
      type: "Business",
      shortTitle: "",
    };
    questionnaire = await createQuestionnaire(ctx, config);
  });

  describe("Resolvers", () => {
    describe("CreateFolder", () => {
      it("Can query a folder's parent section", async () => {
        const [section] = questionnaire.sections;
        const folder = await createFolder(ctx, {
          sectionId: section.id,
          position: 1,
        });

        expect(folder.section.id).toEqual(section.id);
      });

      it("Can query a folder's default displayName", async () => {
        const [section] = questionnaire.sections;
        const folder = await createFolder(ctx, {
          sectionId: section.id,
        });

        expect(folder.displayName).toEqual("Untitled folder");
      });

      it("shouldn't have any validation errors by default", async () => {
        const [section] = questionnaire.sections;
        const folder = await createFolder(ctx, {
          sectionId: section.id,
        });

        expect(folder.validationErrorInfo.totalCount).toEqual(0);
      });
    });

    describe("CreateListCollectorFolder", () => {
      it("should create a list collector folder", async () => {
        const [section] = questionnaire.sections;
        const listCollectorFolder = await createListCollectorFolder(ctx, {
          sectionId: section.id,
          position: 0,
        });

        expect(listCollectorFolder).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            alias: "",
            title: "",
            listId: "",
            displayName: "Untitled list collector",
            position: 0,
            pages: [
              {
                id: expect.any(String),
                pageType: "ListCollectorQualifierPage",
                answers: [
                  {
                    id: expect.any(String),
                    type: "Radio",
                    options: [
                      {
                        id: expect.any(String),
                      },
                      {
                        id: expect.any(String),
                      },
                    ],
                  },
                ],
              },
              {
                id: expect.any(String),
                pageType: "ListCollectorAddItemPage",
              },
              {
                id: expect.any(String),
                pageType: "ListCollectorConfirmationPage",
                answers: [
                  {
                    id: expect.any(String),
                    type: "Radio",
                    options: [
                      {
                        id: expect.any(String),
                      },
                      {
                        id: expect.any(String),
                      },
                    ],
                  },
                ],
              },
            ],
            section: {
              id: expect.any(String),
            },
            validationErrorInfo: {
              id: expect.any(String),
              totalCount: 2,
            },
          })
        );
      });

      it("should change folder list ID to empty when associated collection list is deleted", async () => {
        const [section] = questionnaire.sections;
        await createListCollectorFolder(ctx, {
          sectionId: section.id,
          position: 0,
        });

        expect(ctx.questionnaire.collectionLists.lists.length).toEqual(0);

        const { lists } = await createList(ctx);

        expect(ctx.questionnaire.collectionLists.lists.length).toEqual(1);

        await updateFolder(ctx, {
          folderId: ctx.questionnaire.sections[0].folders[0].id,
          listId: lists[0].id,
        });

        expect(ctx.questionnaire.sections[0].folders[0].listId).toEqual(
          lists[0].id
        );

        deleteList(ctx, { id: lists[0].id });

        expect(ctx.questionnaire.collectionLists.lists.length).toEqual(0);
        expect(ctx.questionnaire.sections[0].folders[0].listId).toEqual("");
      });
    });

    describe("MoveFolder", () => {
      let folderOne, sectionTwo;
      beforeEach(async () => {
        sectionTwo = await createSection(ctx, {
          title: "Section 2",
          alias: "Alias",
          questionnaireId: questionnaire.id,
        });
        folderOne = await createFolder(ctx, {
          sectionId: questionnaire.sections[0].id,
        });
      });

      it("should move a folder", async () => {
        questionnaire = ctx.questionnaire;
        const section = questionnaire.sections[0];
        const folderToMoveId = section.folders[0].id;
        const secondFolder = section.folders[1].id;

        expect(section.folders[0].id).toEqual(folderToMoveId);
        expect(section.folders[1].id).toEqual(secondFolder);
        expect(folderOne.position).toEqual(0);

        const returnedQuestionnaire = await moveFolder(ctx, {
          id: folderOne.id,
          position: 1,
          sectionId: folderOne.sectionsId,
        });

        expect(returnedQuestionnaire.sections[0].folders[0].id).toEqual(
          secondFolder
        );
        expect(returnedQuestionnaire.sections[0].folders[1].id).toEqual(
          folderToMoveId
        );
      });

      it("should move folder a between sections", async () => {
        expect(folderOne.section.id).toEqual(questionnaire.sections[0].id);

        const returnedQuestionnaire = await moveFolder(ctx, {
          id: folderOne.id,
          position: 1,
          sectionId: sectionTwo.id,
        });

        expect(returnedQuestionnaire.sections[1].folders[1].id).toEqual(
          folderOne.id
        );
      });
    });
  });

  describe("Utils", () => {
    it("Can find all folders in a questionnaire", () => {
      const folders = getFolders(ctx);

      expect(folders).toHaveLength(1);
      expect(typeof folders[0]).toBe("object");

      const receivedObjectProperties = Object.keys(folders[0]);

      expect(receivedObjectProperties.sort()).toEqual(folderProperties.sort());
    });

    it("Can find a folder using a given ID in a questionnaire", () => {
      const folderId = questionnaire.sections[0].folders[0].id;
      const receivedFolder = getFolderById(ctx, folderId);

      expect(receivedFolder).toBeTruthy();
      expect(typeof receivedFolder).toBe("object");
      expect(receivedFolder.id).toEqual(folderId);

      const receivedFolderProperties = Object.keys(receivedFolder);

      expect(receivedFolderProperties.sort()).toEqual(folderProperties.sort());
    });

    it("Can find a folder using a given page ID in a questionnaire", () => {
      const folderId = questionnaire.sections[0].folders[0].id;
      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      const receivedFolder = getFolderByPageId(ctx, pageId);

      expect(receivedFolder).toBeTruthy();
      expect(typeof receivedFolder).toBe("object");
      expect(receivedFolder.id).toEqual(folderId);
      expect(receivedFolder.pages[0].id).toEqual(pageId);

      const receivedFolderProperties = Object.keys(receivedFolder);

      expect(receivedFolderProperties.sort()).toEqual(folderProperties.sort());
    });
  });
});
