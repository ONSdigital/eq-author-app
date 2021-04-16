const onFolderDeleted = require("../../src/businessLogic/onFolderDeleted");

module.exports = (ctx, removedSection) => {
  removedSection.folders.forEach((folder) => onFolderDeleted(ctx, folder));
};
