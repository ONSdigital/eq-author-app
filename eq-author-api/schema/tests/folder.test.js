const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  getFolders,
  getFolderById,
  getFolderByPageId,
} = require("../resolvers/utils");

const { createFolder } = require("../../tests/utils/contextBuilder/folder");

const folderProperties = ["id", "alias", "enabled", "pages", "skipConditions"];

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
      theme: "default",
      navigation: false,
      summary: false,
      type: "Business",
      shortTitle: "",
    };
    questionnaire = await createQuestionnaire(ctx, config);
  });

  describe("Resolvers", () => {
    it("Can query a folder's parent section", async () => {
      const [section] = questionnaire.sections;
      const folder = await createFolder(ctx, {
        sectionId: section.id,
      });

      expect(folder.section.id).toEqual(section.id);
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
