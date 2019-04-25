const { compact, find, flatMap, some } = require("lodash");
const deepMap = require("deep-map");
const uuid = require("uuid");

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

const getPageByConfirmationId = (ctx, confirmationId) =>
  find(getPages(ctx), page => {
    if (page.confirmation && page.confirmation.id === confirmationId) {
      return page;
    }
  });

const getConfirmations = ctx =>
  compact(flatMap(getPages(ctx), page => page.confirmation));

const getConfirmationById = (ctx, id) => find(getConfirmations(ctx), { id });

const getAnswers = ctx => compact(flatMap(getPages(ctx), page => page.answers));

const getAnswerById = (ctx, id) => find(getAnswers(ctx), { id });

const getOptions = ctx =>
  compact(flatMap(getAnswers(ctx), answer => answer.options));

const getOptionById = (ctx, id) => find(getOptions(ctx), { id });

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

  getAnswers,
  getAnswerById,

  getOptions,
  getOptionById,

  getConfirmations,
  getConfirmationById,

  remapAllNestedIds,
};
