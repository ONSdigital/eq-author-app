const { filter, find, flatMap, some } = require("lodash");
const { getPages, getPageById } = require("./pageGetters");
const { getFolders, getFolderById } = require("./folderGetters");
const { getConfirmations, getConfirmationById } = require("./pageGetters");

const getRouting = (ctx) =>
  flatMap(filter(getPages(ctx), "routing"), "routing");

const getRoutingById = (ctx, id) => find(getRouting(ctx), { id });

const getRules = (ctx) => flatMap(filter(getRouting(ctx), "rules"), "rules");

const getRoutingRuleById = (ctx, id) => find(getRules(ctx), { id });

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

const getExpressionGroups = (ctx) =>
  flatMap(filter(getRules(ctx), "expressionGroup"), "expressionGroup");

const getAllExpressionGroups = (ctx) => {
  const expressionGroups = getExpressionGroups(ctx);
  return [...expressionGroups, ...getSkipConditions(ctx)];
};

const getExpressionGroupByExpressionId = (ctx, expressionId) =>
  find(
    getAllExpressionGroups(ctx),
    (expressionGroup) =>
      expressionGroup.expressions &&
      some(expressionGroup.expressions, { id: expressionId })
  );

const getExpressionGroupById = (ctx, id) =>
  find(getExpressionGroups(ctx), { id });

const getExpressions = (ctx) => {
  const routingExpressions = flatMap(
    filter(getExpressionGroups(ctx), "expressions"),
    "expressions"
  );
  const skipConditionExpressions = flatMap(
    filter(getSkipConditions(ctx), "expressions"),
    "expressions"
  );

  return [...routingExpressions, ...skipConditionExpressions];
};

const getExpressionById = (ctx, id) => find(getExpressions(ctx), { id });

module.exports = {
  getRouting,
  getRoutingById,
  getRules,
  getRoutingRuleById,
  getExpressionGroups,
  getExpressionGroupById,
  getExpressions,
  getExpressionById,
  getAllExpressionGroups,
  getExpressionGroupByExpressionId,
  getSkippableById,
  getSkippables,
  getSkipConditions,
  getSkipConditionById,
};
