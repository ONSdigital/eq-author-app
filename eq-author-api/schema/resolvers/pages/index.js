const { find, findIndex, remove, omit, set, first } = require("lodash");

const { findSectionByPageId, remapAllNestedIds } = require("../utils");

const addPrefix = require("../../../utils/addPrefix");

const { saveQuestionnaire } = require("../../../utils/datastore");
const { createQuestionPage } = require("./questionPage");

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
  position: ({ id }, args, ctx) => {
    const section = findSectionByPageId(ctx.questionnaire.sections, id);
    return findIndex(section.pages, { id });
  },
};

Resolvers.Mutation = {
  movePage: async (_, { input }, ctx) => {
    const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
    const removedPage = first(remove(section.pages, { id: input.id }));
    if (input.sectionId === section.id) {
      section.pages.splice(input.position, 0, removedPage);
    } else {
      const newsection = find(ctx.questionnaire.sections, {
        id: input.sectionId,
      });
      newsection.pages.splice(input.position, 0, removedPage);
    }
    await saveQuestionnaire(ctx.questionnaire);
    return removedPage;
  },
  deletePage: async (_, { input }, ctx) => {
    const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
    remove(section.pages, { id: input.id });
    await saveQuestionnaire(ctx.questionnaire);
    return section;
  },

  duplicatePage: async (_, { input }, ctx) => {
    const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
    const page = find(section.pages, { id: input.id });
    const newpage = omit(page, "id");
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    section.pages.splice(input.position, 0, remappedPage);
    await saveQuestionnaire(ctx.questionnaire);
    return remappedPage;
  },
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage"),
];
