const { filter, find, flatMap } = require("lodash");
const { getFolders, getFolderById } = require("./folders");
const {
  getPages,
  getPageById,
  getConfirmations,
  getConfirmationById,
} = require("./pages");

const getSkippableById = (ctx, id) =>
  getFolderById(ctx, id) ||
  getConfirmationById(ctx, id) ||
  getPageById(ctx, id);
const getSkippables = (ctx) => [
  ...getFolders(ctx),
  ...getConfirmations(ctx),
  ...getPages(ctx),
];

const getSkipConditions = (ctx) =>
  flatMap(filter(getSkippables(ctx), "skipConditions"), "skipConditions");

const getSkipConditionById = (ctx, id) => {
  const skipConditions = getSkipConditions(ctx);
  return find(skipConditions, { id });
};

module.exports = {
  getSkippableById,
  getSkippables,
  getSkipConditionById,
  getSkipConditions,
};
