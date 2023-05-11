const { logger } = require("../../utils/logger");
const cheerio = require("cheerio");

const updatePipingValue = (htmlText, answerId, newValue) => {
  if (!htmlText) {
    return htmlText;
  }
  const htmlDoc = cheerio.load(htmlText, null, false);
  const dataSpan = htmlDoc(`span[data-id=${answerId}]`);
  dataSpan.each((i, elem) => {
    elem.children[0].data = `[${newValue}]`;
  });
  return htmlDoc.html();
};

const updatePipingInAnswers = (oldAnswerLabel, updatedAnswer, pages) => {
  pages.forEach((page) => {
    const { title, description } = page;
    if (title?.includes(updatedAnswer.id)) {
      page.title = updatePipingValue(
        page.title,
        updatedAnswer.id,
        updatedAnswer.label.replace(/(<([^>]+)>)/gi, "")
      );
    }

    if (description?.includes(updatedAnswer.id)) {
      page.description = updatePipingValue(
        page.description,
        updatedAnswer.id,
        updatedAnswer.label.replace(/(<([^>]+)>)/gi, "")
      );
    }

    page.answers?.forEach((answer) => {
      if (answer.label?.includes(updatedAnswer.id)) {
        answer.label = updatePipingValue(
          answer.label,
          updatedAnswer.id,
          updatedAnswer.label.replace(/(<([^>]+)>)/gi, "")
        );
      }
    });
  });

  logger.info(`Piping In Answers Updated with ID ${updatedAnswer.id}`);

  return pages;
};

module.exports = (ctx, oldAnswerLabel, updatedAnswer, pages) => {
  updatePipingInAnswers(oldAnswerLabel, updatedAnswer, pages);
};
