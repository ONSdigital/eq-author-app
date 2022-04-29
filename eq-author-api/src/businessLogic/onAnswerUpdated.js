const { logger } = require("../../utils/logger");

const updatePipingInAnswers = (oldAnswerLabel, updatedAnswer, pages) => {
  pages.forEach((page) => {
    const { title, description } = page;
    if (title?.includes(updatedAnswer.id)) {
      page.title = title.replace(oldAnswerLabel, updatedAnswer.label);
    }

    if (description?.includes(updatedAnswer.id)) {
      page.description = description.replace(
        oldAnswerLabel,
        updatedAnswer.label
      );
    }
  });

  logger.info(`Piping In Answers Updated with ID ${updatedAnswer.id}`);

  return pages;
};

module.exports = (ctx, oldAnswerLabel, updatedAnswer, pages) => {
  updatePipingInAnswers(oldAnswerLabel, updatedAnswer, pages);
};
