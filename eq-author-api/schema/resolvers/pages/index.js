const { find, findIndex, remove, omit, set, first } = require("lodash");

const { getSectionByPageId, remapAllNestedIds } = require("../utils");
const { withWritePermission } = require("../withWritePermission");

const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(section.pages, { id });
  },
};

Resolvers.Mutation = {
  movePage: withWritePermission((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const removedPage = first(remove(section.pages, { id: input.id }));
    if (input.sectionId === section.id) {
      section.pages.splice(input.position, 0, removedPage);
    } else {
      const newsection = find(ctx.questionnaire.sections, {
        id: input.sectionId,
      });
      newsection.pages.splice(input.position, 0, removedPage);
    }
    return removedPage;
  }),
  deletePage: withWritePermission((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    remove(section.pages, { id: input.id });
    return section;
  }),

  duplicatePage: withWritePermission((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const page = find(section.pages, { id: input.id });
    const newpage = omit(page, "id");
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    section.pages.splice(input.position, 0, remappedPage);
    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage"),
];
