const { compact, filter, find, flatMap, some } = require("lodash");
const { getPages, getSkipConditions } = require("./pageGetters");

const getAnswers = (ctx) =>
  compact(flatMap(getPages(ctx), (page) => page.answers));

const getAnswerById = (ctx, id) => find(getAnswers(ctx), { id });

const getOptions = (ctx) =>
  compact(flatMap(getAnswers(ctx), (answer) => answer.options));

const getOptionById = (ctx, id) => find(getOptions(ctx), { id });

const getRouting = (ctx) =>
  flatMap(filter(getPages(ctx), "routing"), "routing");

const getRoutingById = (ctx, id) => find(getRouting(ctx), { id });

const getRules = (ctx) => flatMap(filter(getRouting(ctx), "rules"), "rules");

const getRoutingRuleById = (ctx, id) => find(getRules(ctx), { id });

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

module.exports = {
  // getSections,
  // getSectionById,
  // getSectionByFolderId,
  // getSectionByPageId,

  // getFolders,
  // getFoldersBySectionId,
  // getFolderById,
  // getFolderByPageId,
  // getPages,
  // getPagesBySectionId,
  // getPagesByFolderId,
  // getPagesFromSection,
  // getPageById,
  // getPageByConfirmationId,
  // getPageByValidationId,
  // getPageByAnswerId,

  getAnswers,
  getAnswerById,

  getOptions,
  getOptionById,

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

  // getConfirmations,
  // getConfirmationById,

  // getSkippableById,
  // getSkippables,

  getSkipConditionById,
  // getSkipConditions,

  getPosition,
  getMovePosition,
};
