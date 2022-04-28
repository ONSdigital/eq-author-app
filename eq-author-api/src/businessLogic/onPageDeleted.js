const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const { logger } = require("../../utils/logger");

module.exports = (ctx, section, removedPage, pages) => {
  if (removedPage.answers) {
    removedPage.answers.forEach((answer) => {
      onAnswerDeleted(ctx, removedPage, answer, pages);
    });
  }
  logger.info(
    { qid: ctx.questionnaire.id },
    `Page Deleted with ID ${removedPage.id}`
  );

  return pages;
};
