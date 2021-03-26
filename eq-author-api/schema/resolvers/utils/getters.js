const { compact, get, filter, find, flatMap, some } = require("lodash");

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

const getFolders = (ctx) => flatMap(getSections(ctx), ({ folders }) => folders);

const getFoldersBySectionId = (ctx, id) => getSectionById(ctx, id).folders;

const getFolderById = (ctx, id) => find(getFolders(ctx), { id });

const getFolderByPageId = (ctx, id) =>
  find(getFolders(ctx), ({ pages }) => pages && some(pages, { id }));

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

const getConfirmations = (ctx) =>
  compact(flatMap(getPages(ctx), (page) => page.confirmation));

const getConfirmationById = (ctx, id) => find(getConfirmations(ctx), { id });

const getSkippableById = (ctx, id) =>
  getFolderById(ctx, id) ||
  getConfirmationById(ctx, id) ||
  getPageById(ctx, id);
const getSkippables = (ctx) => [
  ...getFolders(ctx),
  ...getConfirmations(ctx),
  ...getPages(ctx),
];

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
  getSections,
  getSectionById,
  getSectionByFolderId,
  getSectionByPageId,

  getFolders,
  getFoldersBySectionId,
  getFolderById,
  getFolderByPageId,
  getPages,
  getPagesBySectionId,
  getPagesByFolderId,
  getPagesFromSection,
  getPageById,
  getPageByConfirmationId,
  getPageByValidationId,
  getPageByAnswerId,

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

  getConfirmations,
  getConfirmationById,

  getSkippableById,
  getSkippables,

  getSkipConditionById,
  getSkipConditions,

  getPosition,
  getMovePosition,
};
