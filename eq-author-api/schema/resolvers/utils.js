const { compact, get, filter, find, flatMap, some } = require("lodash");
const deepMap = require("deep-map");
const uuid = require("uuid");

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

const getAnswers = ctx => compact(flatMap(getPages(ctx), page => page.answers));

const getAnswerById = (ctx, id) => find(getAnswers(ctx), { id });

const getOptions = ctx =>
  compact(flatMap(getAnswers(ctx), answer => answer.options));

const getOptionById = (ctx, id) => find(getOptions(ctx), { id });

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
      const newEntityId = uuid.v4();
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

module.exports = {
  getSectionById,
  getSectionByPageId,

  getPages,
  getPageById,
  getPageByConfirmationId,
  getPageByValidationId,

  getAnswers,
  getAnswerById,

  getOptions,
  getOptionById,

  getConfirmations,
  getConfirmationById,

  getValidationById,

  getAvailablePreviousAnswersForValidation,
  getAvailableMetadataForValidation,

  remapAllNestedIds,
};
