const onPageDeleted = require("../../src/businessLogic/onPageDeleted");

const onFolderDeleted = (ctx, removedFolder) => {
  console.log(removedFolder);
  if (removedFolder.pages) {
    removedFolder.pages.forEach(page => {
      onPageDeleted(ctx, removedFolder, page);
    });
  }
};

module.exports = onFolderDeleted;
