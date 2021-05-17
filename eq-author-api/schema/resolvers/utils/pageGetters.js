const { compact, get, find, flatMap, some } = require("lodash");
const { getFolders, getFolderById } = require("./folderGetters");
const { getSectionById } = require("./sectionGetters");

const getPages = (ctx) => flatMap(getFolders(ctx), ({ pages }) => pages);

const getPagesBySectionId = (ctx, id) =>
  flatMap(getSectionById(ctx, id).folders, ({ pages }) => pages);

const getPagesByFolderId = (ctx, id) => getFolderById(ctx, id).pages;

const getPagesFromSection = (section) =>
  flatMap(section.folders, ({ pages }) => pages);

const getPagesByIds = (ctx, ids) =>
  getPages(ctx).filter(({ id }) => ids.includes(id));

const getPageById = (ctx, id) => getPagesByIds(ctx, [id])?.[0];

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

const getConfirmations = (ctx) =>
  compact(flatMap(getPages(ctx), (page) => page.confirmation));

const getConfirmationById = (ctx, id) => find(getConfirmations(ctx), { id });

module.exports = {
  getPages,
  getPagesBySectionId,
  getPagesByFolderId,
  getPagesFromSection,
  getPageById,
  getPagesByIds,
  getPageByConfirmationId,
  getPageByValidationId,
  getPageByAnswerId,
  getConfirmations,
  getConfirmationById,
};
