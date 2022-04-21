const onPageDeleted = require("../../src/businessLogic/onPageDeleted");
const { logger } = require("../../utils/logger");

const onFolderDeleted = (ctx, removedFolder, pages) => {
  if (removedFolder.pages) {
    removedFolder.pages.forEach((page) => {
      onPageDeleted(ctx, removedFolder, page, pages);
    });
    logger.info(`Folder Deleted`);
  }
};

module.exports = onFolderDeleted;
