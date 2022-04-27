const onPageDeleted = require("../../src/businessLogic/onPageDeleted");
const { logger } = require("../../utils/logger");

const onFolderDeleted = (ctx, removedFolder, pages) => {
  if (removedFolder.pages) {
    removedFolder.pages.forEach((page) => {
      onPageDeleted(ctx, removedFolder, page, pages);
    });
    logger.info(
      { qid: ctx.questionnaire.id },
      `Folder Deleted with ID ${removedFolder.id}`
    );
  }
};

module.exports = onFolderDeleted;
