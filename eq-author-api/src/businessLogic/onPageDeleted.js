const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");

module.exports = (ctx, section, removedPage, pages) => {
  if (removedPage.answers) {
    removedPage.answers.forEach((answer) => {
      onAnswerDeleted(ctx, removedPage, answer, pages);
    });
  }

  return pages;
};
