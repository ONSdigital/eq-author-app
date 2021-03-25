const { omit, remove } = require("lodash");

const {
  getSectionByPageId,
  remapAllNestedIds,
  getSectionById,
  getPageById,
  getMovePosition,
  getFolderById,
  getFolderByPageId,
} = require("../utils/utils");

const { createFolder } = require("../../../src/businessLogic");

const onPageDeleted = require("../../../src/businessLogic/onPageDeleted");
const { createMutation } = require("../createMutation");
const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");
const deleteFirstPageSkipConditions = require("../../../src/businessLogic/deleteFirstPageSkipConditions");
const deleteLastPageRouting = require("../../../src/businessLogic/deleteLastPageRouting");
const onFolderDeleted = require("../../../src/businessLogic/onFolderDeleted");

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
};

Resolvers.Mutation = {
  movePage: createMutation((_, { input }, ctx) => {
    const { id: pageId, sectionId, folderId, position } = input;

    const page = getPageById(ctx, pageId);
    const oldSection = getSectionByPageId(ctx, pageId);
    const oldFolder = getFolderByPageId(ctx, pageId);
    const newSection = getSectionById(ctx, sectionId);

    const oldPages = oldFolder.pages;
    oldPages.splice(oldPages.indexOf(page), 1);

    if (!oldPages.length) {
      if (oldSection.folders.length > 1 && !oldFolder.enabled) {
        const removedFolder = remove(oldSection.folders, {
          id: oldFolder.id,
        });
        onFolderDeleted(ctx, removedFolder);
      } else {
        oldPages.push(createQuestionPage());
      }
    }

    if (folderId) {
      const folder = getFolderById(ctx, folderId);
      folder.pages.splice(position, 0, page);
      page.folderId = folder.id;
    } else {
      const { folders } = newSection;
      const newFolder = createFolder({ pages: [page] });
      folders.splice(position, 0, newFolder);
      page.folderId = newFolder.id;
    }

    deleteFirstPageSkipConditions(ctx);
    deleteLastPageRouting(ctx);

    return { ...page, sectionId: newSection.id };
  }),

  deletePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const { previous } = getMovePosition(section, input.id, 0);

    const folder = section.folders[previous.folderIndex];
    folder.pages.splice(previous.pageIndex, 1);

    onPageDeleted(ctx, section, previous.page);

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

    return section;
  }),

  duplicatePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const page = getPageById(ctx, input.id);
    const newpage = omit(page, "id");
    newpage.alias = addPrefix(newpage.alias);
    newpage.title = addPrefix(newpage.title);
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    const { previous } = getMovePosition(section, input.id, input.position);
    const previousFolder = section.folders[previous.folderIndex];

    if (previousFolder.enabled) {
      previousFolder.pages.splice(input.position, 0, remappedPage);
    } else {
      section.folders.splice(
        previous.folderIndex + 1,
        0,
        createFolder({
          pages: [remappedPage],
        })
      );
    }

    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage").Resolvers,
];
