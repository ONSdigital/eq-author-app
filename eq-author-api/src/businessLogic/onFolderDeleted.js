const onPageDeleted = require("../../src/businessLogic/onPageDeleted");

const onFolderDeleted = (ctx, removedFolder) => {
  removedFolder.pages.forEach(page => {
    onPageDeleted(ctx, removedFolder, page);
  });
};

module.exports = onFolderDeleted;
