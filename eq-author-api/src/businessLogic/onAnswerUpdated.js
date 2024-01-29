const { logger } = require("../../utils/logger");
const cheerio = require("cheerio");
const {
  getListById,
  getSupplementaryDataAsCollectionListById,
  getSections,
} = require("../../schema/resolvers/utils");

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

const updatePipingInSections = (ctx, updatedAnswer) => {
  const sections = getSections(ctx);

  sections.forEach((section) => {
    if (section.title?.includes(updatedAnswer.id)) {
      section.title = updatePipingValue(
        section.title,
        updatedAnswer.id,
        updatedAnswer.label.replace(/(<([^>]+)>)/gi, "")
      );
    }
    if (section.introductionTitle?.includes(updatedAnswer.id)) {
      section.introductionTitle = updatePipingValue(
        section.introductionTitle,
        updatedAnswer.id,
        updatedAnswer.label.replace(/(<([^>]+)>)/gi, "")
      );
    }
    if (section.introductionContent?.includes(updatedAnswer.id)) {
      section.introductionContent = updatePipingValue(
        section.introductionContent,
        updatedAnswer.id,
        updatedAnswer.label.replace(/(<([^>]+)>)/gi, "")
      );
    }
  });
};

const updatePipingInAnswers = (updatedAnswer, pages) => {
  if (updatedAnswer.label) {
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
  }

  logger.info(`Piping In Answers Updated with ID ${updatedAnswer.id}`);

  return pages;
};

const updatePipingRepeatingAnswer = (ctx, updatedAnswer, oldAnswer) => {
  if (
    !updatedAnswer.repeatingLabelAndInput &&
    !oldAnswer.repeatingLabelAndInput
  ) {
    return;
  }
  if (
    updatedAnswer.repeatingLabelAndInputListId ===
    oldAnswer.repeatingLabelAndInputListId
  ) {
    return;
  }
  const oldList =
    getListById(ctx, oldAnswer?.repeatingLabelAndInputListId) ||
    getSupplementaryDataAsCollectionListById(
      ctx,
      oldAnswer?.repeatingLabelAndInputListId
    ) ||
    [];
  const newList =
    getListById(ctx, updatedAnswer?.repeatingLabelAndInputListId) ||
    getSupplementaryDataAsCollectionListById(
      ctx,
      updatedAnswer?.repeatingLabelAndInputListId
    ) ||
    [];

  oldList?.answers?.forEach((answer) => {
    updatedAnswer.label = updatePipingValue(
      updatedAnswer.label,
      answer.id,
      "Deleted answer"
    );
  });

  newList?.answers?.forEach((answer) => {
    updatedAnswer.label = updatePipingValue(
      updatedAnswer.label,
      answer.id,
      answer.label.replace(/(<([^>]+)>)/gi, "") || "Untitled answer"
    );
  });
};

module.exports = (ctx, updatedAnswer, pages, oldAnswer) => {
  updatePipingInAnswers(updatedAnswer, pages);
  updatePipingRepeatingAnswer(ctx, updatedAnswer, oldAnswer);
  updatePipingInSections(ctx, updatedAnswer);
};
