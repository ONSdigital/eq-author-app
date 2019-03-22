const { compact, find, flatMap, some } = require("lodash");
const deepMap = require("deep-map");
const uuid = require("uuid");

const getPage = ctx => input => {
  const pages = flatMap(ctx.questionnaire.sections, section => section.pages);
  return find(pages, { id: input.pageId });
};

const getAnswers = ctx => {
  return flatMap(ctx.questionnaire.sections, section =>
    compact(flatMap(section.pages, page => page.answers))
  );
};

const getAnswer = ctx => input => {
  const answers = getAnswers(ctx);
  return find(answers, { id: input.answerId });
};

const findSectionByPageId = (sections, id) =>
  find(sections, section => {
    if (section.pages && some(section.pages, { id })) {
      return section;
    }
  });

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
  getPage,
  getAnswers,
  getAnswer,
  findSectionByPageId,
  remapAllNestedIds,
};
