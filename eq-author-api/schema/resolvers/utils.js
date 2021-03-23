const { compact, get, filter, find, flatMap, some } = require("lodash");
const deepMap = require("deep-map");
const { v4: uuidv4 } = require("uuid");

const getConfirmations = (ctx) =>
  compact(flatMap(getPages(ctx), (page) => page.confirmation));

const getConfirmationById = (ctx, id) => find(getConfirmations(ctx), { id });

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

// Efficiently check if questionnaire contains entity with given id
const idExists = (ctx, id) => getOrderedIdMap(ctx).get(id) !== undefined;

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

  // getThemeByShortName,
  // createTheme,

  idExists,
  getAbsolutePositionById,

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

  // getAnswers,
  // getAnswerById,

  // getOptions,
  // getOptionById,

  // getRouting,
  // getRoutingById,
  // getRules,
  // getRoutingRuleById,
  // getExpressionGroups,
  // getExpressionGroupById,
  // getExpressions,
  // getExpressionById,
  // getAllExpressionGroups,
  // getExpressionGroupByExpressionId,

  getConfirmations,
  getConfirmationById,

  // getSkippableById,
  // getSkippables,

  getValidationById,
  getValidationErrorInfo,
  returnValidationErrors,

  remapAllNestedIds,

  // getSkipConditionById,
  // getSkipConditions,

  createQuestionPage,
  createCalculatedSummary,
  // createFolder,
  // createSection,

  getPosition,
  getMovePosition,
};
