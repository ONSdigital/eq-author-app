const { find, some } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { createFolder } = require("./folders");

const getSections = (ctx) => ctx.questionnaire.sections;

const getSectionById = (ctx, id) => find(getSections(ctx), { id });

const getSectionByFolderId = (ctx, folderId) =>
  find(getSections(ctx), (section) => {
    if (section.folders && some(section.folders, { id: folderId })) {
      return section;
    }
  });

const getSectionByPageId = (ctx, pageId) =>
  find(getSections(ctx), (section) =>
    some(section.folders, (folder) => {
      if (folder.pages && some(folder.pages, { id: pageId })) {
        return section;
      }
    })
  );

const createSection = (input = {}) => ({
  id: uuidv4(),
  title: "",
  introductionEnabled: false,
  folders: [createFolder()],
  alias: "",
  ...input,
});

module.exports = {
  getSections,
  getSectionById,
  getSectionByFolderId,
  getSectionByPageId,
  createSection,
};
