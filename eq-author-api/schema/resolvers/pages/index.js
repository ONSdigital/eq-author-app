const { findIndex, omit, set, filter, remove, first } = require("lodash");

const {
  getSectionByPageId,
  getPagesBySectionId,
  remapAllNestedIds,
  getSectionById,
  getPageById,
  getMovePosition,
  createFolder,
  getFolderById,
} = require("../utils");

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
  position: ({ id }, args, ctx) => findIndex(getPagesBySectionId(ctx, id), id),
};

Resolvers.Mutation = {
  movePage: createMutation((_, { input }, ctx) => {
    const { id: pageId, sectionId, folderId, position } = input;

    const page = getPageById(ctx, pageId);
    const oldSection = getSectionByPageId(ctx, pageId);
    const newSection = getSectionById(ctx, sectionId);

    oldSection.folders.map(folder => {
      const { enabled, pages } = folder;
      const index = pages.findIndex(({ id }) => id === page.id);

      if (index > -1) {
        pages.splice(index, 1);

        if (enabled && !pages.length) {
          pages.push(createQuestionPage());
        }
      }
    });

    oldSection.folders = filter(
      oldSection.folders,
      ({ pages }) => pages.length
    );

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
    section.folders[previous.folderIndex].pages.splice(previous.pageIndex, 1);

    onPageDeleted(ctx, section, previous.page);

    if (!section.folders[previous.folderIndex].pages.length) {
      if (section.folders.length > 1) {
        // If this isn't the section's last folder - delete it if it's empty
        const [deletedFolder] = section.folders.splice(previous.folderIndex, 1);
        onFolderDeleted(ctx, deletedFolder);
      } else {
        // If this is the section's last folder, re-populate it with a new question
        const newPage = createQuestionPage();
        section.folders[previous.folderIndex].pages.push(newPage);
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
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    const { previous } = getMovePosition(section, input.id, input.position);
    section.folders[previous.folderIndex].pages.splice(
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
