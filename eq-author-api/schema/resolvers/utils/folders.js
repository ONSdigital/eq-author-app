const { find, flatMap, some } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { getSections, getSectionById } = require("./sections");

const getFolders = (ctx) => flatMap(getSections(ctx), ({ folders }) => folders);

const getFoldersBySectionId = (ctx, id) => getSectionById(ctx, id).folders;

const getFolderById = (ctx, id) => find(getFolders(ctx), { id });

const getFolderByPageId = (ctx, id) =>
  find(getFolders(ctx), ({ pages }) => pages && some(pages, { id }));

const createFolder = (input = {}, calcSum = false) => ({
  id: uuidv4(),
  alias: "",
  enabled: false,
  pages: [calcSum ? createCalculatedSummary() : createQuestionPage()],
  skipConditions: null,
  ...input,
});

module.exports = {
  getFolders,
  getFoldersBySectionId,
  getFolderById,
  getFolderByPageId,
  createFolder,
};
