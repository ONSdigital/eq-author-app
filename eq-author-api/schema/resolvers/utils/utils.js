const { compact, get, filter, find, flatMap, some } = require("lodash");
const deepMap = require("deep-map");
const { v4: uuidv4 } = require("uuid");

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

const getValidationById = (ctx, id) => {
  const answers = getAnswers(ctx);
  const answerValidations = flatMap(answers, (answer) =>
    Object.keys(answer.validation).map((validationType) => {
      const validation = answer.validation[validationType];
      validation.validationType = validationType;
      return validation;
    })
  );

  const pageValidations = compact(
    flatMap(getPages(ctx), (page) => page.totalValidation)
  );
  pageValidations.forEach((validation) => {
    validation.validationType = "total";
  });

  return find([...answerValidations, ...pageValidations], { id: id });
};

const remapAllNestedIds = (entity) => {
  const transformationMatrix = {};
  const remappedIdEntity = deepMap(entity, (value, key) => {
    if (key === "id") {
      const newEntityId = uuidv4();
      transformationMatrix[value] = newEntityId;
      return newEntityId;
    }
    return value;
  });
  return deepMap(remappedIdEntity, (value) => {
    if (Object.keys(transformationMatrix).includes(value)) {
      return transformationMatrix[value];
    }
    return value;
  });
};

// Transforms questionnaire into a hash map, mapping IDs to absolute positions
// Thereafter allows O(1) lookup to check if IDs exist & get their positions
const generateOrderedIdMap = ({ questionnaire }) => {
  const map = new Map();

  const traverseIds = (obj) => {
    if (!obj || typeof obj !== "object") {
      return;
    }

    for (const key of Object.keys(obj)) {
      if (key === "id") {
        continue; // Process parent's ID after all children are processed
      }

      if (typeof obj[key] === "object") {
        traverseIds(obj[key]);
      }
    }

    if (obj.id && typeof obj.id === "string") {
      map.set(obj.id, map.size);
    }
  };

  traverseIds(questionnaire);
  return map;
};

// Memoized interface to generateOrderedIdMap
// Only re-compute ordered ID hash map when necessary (different questionnaire / questionnaire has changed)
const getOrderedIdMap = (ctx) => {
  if (getOrderedIdMap.lastInvokation) {
    const {
      questionnaireId,
      updatedAt,
      result,
    } = getOrderedIdMap.lastInvokation;
    if (
      ctx.questionnaire.id === questionnaireId &&
      ctx.questionnaire.updatedAt === updatedAt
    ) {
      return result;
    }
  }

  getOrderedIdMap.lastInvokation = {
    questionnaireId: ctx.questionnaire.id,
    updatedAt: ctx.questionnaire.updatedAt,
    result: generateOrderedIdMap(ctx),
  };

  return getOrderedIdMap.lastInvokation.result;
};

// Efficiently get absolute position in questionnaire for entity with given id
// Later pages, answers etc. have higher values than earlier pages, answers, etc.
const getAbsolutePositionById = (ctx, id) => getOrderedIdMap(ctx).get(id);

const getValidationErrorInfo = (ctx) => ctx.validationErrorInfo;

const returnValidationErrors = (ctx, id, ...conditions) => {
  const errors = conditions.reduce((acc, condition) => {
    acc.push(...getValidationErrorInfo(ctx).filter(condition));
    return acc;
  }, []);

  if (!errors.length) {
    return {
      id,
      errors: [],
      totalCount: 0,
    };
  }

  return {
    id,
    errors,
    totalCount: errors.length,
  };
};

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

const getThemeByShortName = ({ questionnaire }, shortName) =>
  questionnaire.themes.find((theme) => theme.shortName === shortName);

const createTheme = (attrs = {}) => ({
  id: uuidv4(),
  enabled: true,
  shortName: "default",
  legalBasisCode: "NOTICE_1",
  eqId: "",
  formType: "",
  ...attrs,
});

module.exports = {
  getSections,
  getSectionById,
  getSectionByFolderId,
  getSectionByPageId,

  getThemeByShortName,
  createTheme,

  // idExists,
  getAbsolutePositionById,

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

  getValidationById,
  getValidationErrorInfo,
  returnValidationErrors,

  remapAllNestedIds,

  getSkipConditionById,
  getSkipConditions,

  getPosition,
  getMovePosition,
};
