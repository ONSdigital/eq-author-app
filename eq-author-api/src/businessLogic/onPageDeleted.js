const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const { logger } = require("../../utils/logger");

module.exports = (ctx, section, removedPage, pages) => {
  if (removedPage.answers) {
    removedPage.answers.forEach((answer) => {
      onAnswerDeleted(ctx, removedPage, answer, pages);
    });
  }
  logger.info(`Page Deleted`);

  return pages;
};
