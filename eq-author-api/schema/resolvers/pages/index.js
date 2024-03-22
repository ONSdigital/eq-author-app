const { omit, cloneDeep, merge } = require("lodash");

const {
  getSectionByPageId,
  remapAllNestedIds,
  getSectionById,
  getPageById,
  getMovePosition,
  getFolderById,
  getFolderByPageId,
  getPages,
} = require("../utils");

const { createFolder } = require("../../../src/businessLogic");

const onPageDeleted = require("../../../src/businessLogic/onPageDeleted");
const { createMutation } = require("../createMutation");
const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");
const deleteFirstPageSkipConditions = require("../../../src/businessLogic/deleteFirstPageSkipConditions");
const deleteLastPageRouting = require("../../../src/businessLogic/deleteLastPageRouting");
const onFolderDeleted = require("../../../src/businessLogic/onFolderDeleted");
const { setDataVersion } = require("../utils/setDataVersion");

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
};

Resolvers.Mutation = {
  updatePage: createMutation((_, { input }, ctx) => {
    const { id } = input;
    const page = getPageById(ctx, id);

    merge(page, input);
    return page;
  }),

  movePage: createMutation((_, { input }, ctx) => {
    const { id: pageId, sectionId, folderId, position } = input;

    const page = getPageById(ctx, pageId);
    const oldFolder = getFolderByPageId(ctx, pageId);
    const newSection = getSectionById(ctx, sectionId);

    const oldPages = oldFolder.pages;
    oldPages.splice(oldPages.indexOf(page), 1);

    if (!oldPages.length) {
      oldPages.push(createQuestionPage());
    }

    if (folderId) {
      const folder = getFolderById(ctx, folderId);
      folder.pages.splice(position, 0, page);
    } else {
      const { folders } = newSection;
      const newFolder = createFolder({ pages: [page] });
      folders.splice(position, 0, newFolder);
    }

    deleteFirstPageSkipConditions(ctx);
    deleteLastPageRouting(ctx);

    return ctx.questionnaire;
  }),

  deletePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const { previous } = getMovePosition(section, input.id, 0);
    const pages = getPages(ctx);

    const folder = section.folders[previous.folderIndex];
    folder.pages.splice(previous.pageIndex, 1);

    onPageDeleted(ctx, section, previous.page, pages);

    if (!folder.pages.length) {
      if (section.folders.length > 1 && !folder.enabled) {
        section.folders.splice(previous.folderIndex, 1);
        onFolderDeleted(ctx, folder);
      } else {
        folder.pages.push(createQuestionPage());
      }
    }

    deleteFirstPageSkipConditions(ctx);
    deleteLastPageRouting(ctx);
    setDataVersion(ctx);

    return section;
  }),

  duplicatePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const page = getPageById(ctx, input.id);
    const newpage = omit(page, "id");
    newpage.alias = addPrefix(newpage.alias);
    newpage.title = addPrefix(newpage.title);
    newpage.pageDescription = addPrefix(newpage.pageDescription);

    const duplicatedPage = createQuestionPage(cloneDeep(newpage));
    if (duplicatedPage.confirmation) {
      duplicatedPage.confirmation.pageDescription = addPrefix(
        duplicatedPage.confirmation.pageDescription
      );
    }
    const remappedPage = remapAllNestedIds(duplicatedPage);
    const { previous } = getMovePosition(section, input.id, input.position);
    const folder = section.folders[previous.folderIndex];

    folder.pages.splice(input.position, 0, remappedPage);

    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage").Resolvers,
  require("./listCollectorPage").Resolvers,
  require("./listCollectorPages").Resolvers,
];
