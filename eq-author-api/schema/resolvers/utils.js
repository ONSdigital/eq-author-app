const { compact, get, filter, find, flatMap, some } = require("lodash");
const deepMap = require("deep-map");
const { v4: uuidv4 } = require("uuid");

const { DATE, DATE_RANGE, UNIT } = require("../../constants/answerTypes");
const { DATE: METADATA_DATE } = require("../../constants/metadataTypes");

const getPreviousAnswersForPage = require("../../src/businessLogic/getPreviousAnswersForPage");

const getSections = ctx => ctx.questionnaire.sections;

const getSectionById = (ctx, id) => find(getSections(ctx), { id });

const getSectionByPageId = (ctx, pageId) =>
  find(getSections(ctx), section => {
    if (section.pages && some(section.pages, { id: pageId })) {
      return section;
    }
  });

const getPages = ctx => flatMap(getSections(ctx), section => section.pages);

const getPageById = (ctx, id) => find(getPages(ctx), { id });

const getPageByAnswerId = (ctx, answerId) =>
  find(
    getPages(ctx),
    page => page.answers && some(page.answers, { id: answerId })
  );

const getPageByConfirmationId = (ctx, confirmationId) =>
  find(getPages(ctx), page => {
    if (get(page, "confirmation.id") === confirmationId) {
      return page;
    }
  });

const getPageByValidationId = (ctx, validationId) =>
  find(
    getPages(ctx),
    page => page.totalValidation && page.totalValidation.id === validationId
  );

const getConfirmations = ctx =>
  compact(flatMap(getPages(ctx), page => page.confirmation));

const getConfirmationById = (ctx, id) => find(getConfirmations(ctx), { id });

const getSkippableById = (ctx, id) =>
  getConfirmationById(ctx, id) || getPageById(ctx, id);
const getSkippables = ctx => [...getConfirmations(ctx), ...getPages(ctx)];

const getAnswers = ctx => compact(flatMap(getPages(ctx), page => page.answers));

const getAnswerById = (ctx, id) => find(getAnswers(ctx), { id });

const getOptions = ctx =>
  compact(flatMap(getAnswers(ctx), answer => answer.options));

const getOptionById = (ctx, id) => find(getOptions(ctx), { id });

const getRouting = ctx => flatMap(filter(getPages(ctx), "routing"), "routing");

const getRoutingById = (ctx, id) => find(getRouting(ctx), { id });

const getRules = ctx => flatMap(filter(getRouting(ctx), "rules"), "rules");

const getRoutingRuleById = (ctx, id) => find(getRules(ctx), { id });

const getSkipConditions = ctx =>
  flatMap(filter(getSkippables(ctx), "skipConditions"), "skipConditions");

const getSkipConditionById = (ctx, id) => {
  const skipConditions = getSkipConditions(ctx);
  return find(skipConditions, { id });
};

const getExpressionGroups = ctx =>
  flatMap(filter(getRules(ctx), "expressionGroup"), "expressionGroup");

const getAllExpressionGroups = ctx => {
  const expressionGroups = getExpressionGroups(ctx);
  return [...expressionGroups, ...getSkipConditions(ctx)];
};

const getExpressionGroupByExpressionId = (ctx, expressionId) =>
  find(
    getAllExpressionGroups(ctx),
    expressionGroup =>
      expressionGroup.expressions &&
      some(expressionGroup.expressions, { id: expressionId })
  );

const getExpressionGroupById = (ctx, id) =>
  find(getExpressionGroups(ctx), { id });

const getExpressions = ctx => {
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
  const answerValidations = flatMap(answers, answer =>
    Object.keys(answer.validation).map(validationType => {
      const validation = answer.validation[validationType];
      validation.validationType = validationType;
      return validation;
    })
  );

  const pageValidations = compact(
    flatMap(getPages(ctx), page => page.totalValidation)
  );
  pageValidations.forEach(validation => {
    validation.validationType = "total";
  });

  return find([...answerValidations, ...pageValidations], { id: id });
};

const getAnswerByValidationId = (ctx, validationId) =>
  getAnswers(ctx).find(answer =>
    Object.values(answer.validation).find(
      validation => validation.id === validationId
    )
  );
const getAvailablePreviousAnswersForValidation = (ctx, validationId) => {
  const answer = getAnswerByValidationId(ctx, validationId);
  const currentPage = getPageByAnswerId(ctx, answer.id);

  const previousAnswers = getPreviousAnswersForPage(
    ctx.questionnaire,
    currentPage.id,
    false,
    [answer.type]
  );

  if (answer.type === UNIT) {
    return previousAnswers.filter(
      previousAnswer =>
        previousAnswer.properties.unit === answer.properties.unit
    );
  }
  return previousAnswers;
};

const getAvailableMetadataForValidation = (ctx, validationId) => {
  const answer = getAnswerByValidationId(ctx, validationId);
  if (answer.type === DATE || answer.type === DATE_RANGE) {
    return filter(ctx.questionnaire.metadata, { type: METADATA_DATE });
  } else {
    return []; //Currently do not support validation against any other types
  }
};

const remapAllNestedIds = entity => {
  const transformationMatrix = {};
  const remappedIdEntity = deepMap(entity, (value, key) => {
    if (key === "id") {
      const newEntityId = uuidv4();
      transformationMatrix[value] = newEntityId;
      return newEntityId;
    }
    return value;
  });
  return deepMap(remappedIdEntity, value => {
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

  const traverseIds = obj => {
    if (typeof obj !== "object") {
      return;
    }

    Object.keys(obj).forEach(key => {
      if (obj[key]) {
        if (key === "id" && typeof obj[key] === "string") {
          map.set(obj[key], map.size);
        }

        if (typeof obj[key] === "object") {
          traverseIds(obj[key]);
        }
      }
    });
  };

  traverseIds(questionnaire);
  return map;
};

// Memoized interface to generateOrderedIdMap
// Only re-compute ordered ID hash map when necessary (different questionnaire / questionnaire has changed)
const getOrderedIdMap = ctx => {
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

// Efficiently check if questionnaire contains entity with given id
const idExists = (ctx, id) => {
  return getOrderedIdMap(ctx).get(id) !== undefined;
};

// Efficiently get absolute position in questionnaire for entity with given id
// Later pages, answers etc. have higher values than earlier pages, answers, etc.
const getAbsolutePositionById = (ctx, id) => {
  return getOrderedIdMap(ctx).get(id);
};

module.exports = {
  getSectionById,
  getSectionByPageId,

  idExists,
  getAbsolutePositionById,

  getPages,
  getPageById,
  getPageByConfirmationId,
  getPageByValidationId,

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

  getAvailablePreviousAnswersForValidation,
  getAvailableMetadataForValidation,

  remapAllNestedIds,

  getSkipConditionById,
  getSkipConditions,
};
