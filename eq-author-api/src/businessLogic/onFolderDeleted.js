const onPageDeleted = require("../../src/businessLogic/onPageDeleted");

const onFolderDeleted = (ctx, removedFolder, pages) => {
  if (removedFolder.pages) {
    removedFolder.pages.forEach((page) => {
      onPageDeleted(ctx, removedFolder, page, pages);
    });
  }
};

module.exports = onFolderDeleted;
