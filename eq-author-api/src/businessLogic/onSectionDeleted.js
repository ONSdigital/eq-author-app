const onFolderDeleted = require("../../src/businessLogic/onFolderDeleted");

module.exports = (ctx, removedSection, pages) => {
  removedSection.folders.forEach((folder) =>
    onFolderDeleted(ctx, folder, pages)
  );
};
