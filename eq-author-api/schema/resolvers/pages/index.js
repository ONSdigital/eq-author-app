const { findIndex, omit, set } = require("lodash");

const {
  getSectionByPageId,
  getPagesBySectionId,
  remapAllNestedIds,
  getSectionById,
  getPageById,
  getMovePosition,
} = require("../utils");

const onPageDeleted = require("../../../src/businessLogic/onPageDeleted");
const { createMutation } = require("../createMutation");
const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
  position: ({ id }, args, ctx) =>
    findIndex(getPagesBySectionId(ctx, id), { id }),
};

Resolvers.Mutation = {
  movePage: createMutation((_, { input }, ctx) => {
    // not 100% sold on this implementation yet
    const section = getSectionByPageId(ctx, input.id);
    const { id, position } = input;
    let removedPage;
    if (input.sectionId === section.id) {
      const { previous, next } = getMovePosition(section, id, position);
      removedPage = previous.page;
      section.folders[previous.folderIndex].pages.splice(previous.pageIndex, 1);
      section.folders[next.folderIndex].pages.splice(
        position,
        0,
        previous.page
      );
    } else {
      const newSection = getSectionById(input.sectionId);
      const { previous, next } = getMovePosition(newSection, id, position);
      removedPage = previous.page;
      newSection.folders[previous.folderIndex].pages.splice(
        previous.pageIndex,
        1
      );
      newSection.folders[next.folderIndex].pages.splice(
        position,
        0,
        previous.page
      );
    }
    return removedPage;
  }),
  deletePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const { previous } = getMovePosition(section, input.id, 0);
    section.folders[previous.folderIndex].pages.splice(previous.pageIndex, 1);

    onPageDeleted(ctx, section, previous.page);

    // This needs some more thought
    // if (!section.folders[previous.folderIndex].pages.length) {
    //   section.folders.splice(previous.folderIndex, 1);
    // }

    return section;
  }),
  duplicatePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const page = getPageById(ctx, input.id);
    const newpage = omit(page, "id");
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    const { next } = getMovePosition(section, input.id, input.position);
    section.folders[next.folderIndex].pages.splice(
      input.position,
      0,
      remappedPage
    );
    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage").Resolvers,
];
