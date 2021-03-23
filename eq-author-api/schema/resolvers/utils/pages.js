const { get, compact, find, flatMap, some } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { getFolders, getFolderById } = require("./folders");
const { getSectionById } = require("./sections");

const getPages = (ctx) => flatMap(getFolders(ctx), ({ pages }) => pages);

const getPagesBySectionId = (ctx, id) =>
  flatMap(getSectionById(ctx, id).folders, ({ pages }) => pages);

const getPagesByFolderId = (ctx, id) => getFolderById(ctx, id).pages;

const getPagesFromSection = (section) =>
  flatMap(section.folders, ({ pages }) => pages);

const getPageById = (ctx, id) => find(getPages(ctx), { id });

const getPageByAnswerId = (ctx, answerId) =>
  find(
    getPages(ctx),
    (page) => page.answers && some(page.answers, { id: answerId })
  );

const getPageByConfirmationId = (ctx, confirmationId) =>
  find(getPages(ctx), (page) => {
    if (get(page, "confirmation.id") === confirmationId) {
      return page;
    }
  });

const getPageByValidationId = (ctx, validationId) =>
  find(
    getPages(ctx),
    (page) => page.totalValidation && page.totalValidation.id === validationId
  );

const getPosition = (position, comparator) =>
  typeof position === "number" ? position : comparator.length;

const getMovePosition = (section, pageId, position) => {
  if (!section.folders) {
    throw new Error("Section doesn't have a folder");
  }

  let pointer = 0;
  let positionMap = {};

  for (let i = 0; i < section.folders.length; i++) {
    for (let j = 0; j < section.folders[i].pages.length; j++) {
      const page = section.folders[i].pages[j];
      if (page.id === pageId) {
        positionMap.previous = {
          folderIndex: i,
          pageIndex: j,
          page,
        };
      }
      if (pointer === position) {
        positionMap.next = { folderIndex: i };
      }
      pointer++;
    }
  }

  const { previous, next } = positionMap;
  return { previous, next };
};

const getConfirmations = (ctx) =>
  compact(flatMap(getPages(ctx), (page) => page.confirmation));

const getConfirmationById = (ctx, id) => find(getConfirmations(ctx), { id });

const createQuestionPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "QuestionPage",
  title: "",
  description: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  answers: [],
  routing: null,
  alias: null,
  ...input,
});

const createCalculatedSummary = (input = {}) => ({
  id: uuidv4(),
  title: "",
  pageType: "CalculatedSummaryPage",
  summaryAnswers: [],
  ...input,
});

module.exports = {
  getPages,
  getPagesBySectionId,
  getPagesByFolderId,
  getPagesFromSection,
  getPageById,
  getPageByConfirmationId,
  getPageByValidationId,
  getPageByAnswerId,
  getMovePosition,
  getPosition,
  getConfirmations,
  getConfirmationById,
  createQuestionPage,
  createCalculatedSummary,
};
