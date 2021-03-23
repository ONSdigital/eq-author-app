const { get, find, flatMap, some } = require("lodash");
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

module.exports = {
  getPages,
  getPagesBySectionId,
  getPagesByFolderId,
  getPagesFromSection,
  getPageById,
  getPageByConfirmationId,
  getPageByValidationId,
  getPageByAnswerId,
};
