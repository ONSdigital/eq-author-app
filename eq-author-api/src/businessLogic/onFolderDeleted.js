const onPageDeleted = require("../../src/businessLogic/onPageDeleted");
const { getPages } = require("../../schema/resolvers/utils");

const onFolderDeleted = (ctx, removedFolder) => {
  removedFolder.pages.forEach(page => {
    onPageDeleted(ctx, removedFolder, page);
  });

  const allPages = getPages(ctx);
  allPages.forEach(page => {
    if (!page.routing) {
      return;
    }
  });
};

module.exports = onFolderDeleted;
