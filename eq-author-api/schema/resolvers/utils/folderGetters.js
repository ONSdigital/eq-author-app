const { find, flatMap, some } = require("lodash");
const { getSections, getSectionById } = require("./sectionGetters");

const getFolders = (ctx) => flatMap(getSections(ctx), ({ folders }) => folders);

const getFoldersBySectionId = (ctx, id) => getSectionById(ctx, id).folders;

const getFolderById = (ctx, id) => find(getFolders(ctx), { id });

const getFolderByPageId = (ctx, id) =>
  find(getFolders(ctx), ({ pages }) => pages && some(pages, { id }));

const getFolderByAnswerId = (ctx, id) =>
  find(
    getFolders(ctx),
    ({ pages }) =>
      pages && some(pages, ({ answers }) => answers && some(answers, { id }))
  );

const getFoldersByIds = (ctx, ids) =>
  getFolders(ctx).filter(({ id }) => ids.includes(id));

module.exports = {
  getFolders,
  getFoldersBySectionId,
  getFolderById,
  getFolderByPageId,
  getFolderByAnswerId,
  getFoldersByIds,
};
