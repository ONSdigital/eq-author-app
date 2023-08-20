const {
  getListById,
  getSupplementaryDataAsCollectionListById,
} = require("../../schema/resolvers/utils");
const { flatMap } = require("lodash");
const cheerio = require("cheerio");

const updatePipingValue = (htmlText, answerId, newValue) => {
  if (!htmlText) {
    return htmlText;
  }
  const htmlDoc = cheerio.load(htmlText, null, false);
  const dataSpan = htmlDoc(`span[data-id=${answerId}]`);
  dataSpan.each((i, elem) => {
    elem.children[0].data = `[${newValue.replace(/(<([^>]+)>)/gi, "")}]`;
  });
  return htmlDoc.html();
};

const updatePipingFromAnswer = (answer, pages, newValue) => {
  pages.forEach((page) => {
    page.title = updatePipingValue(page.title, answer.id, newValue);
    page.description = updatePipingValue(page.description, answer.id, newValue);
  });
  return pages;
};

const deletePiping = (answers, section, pages) => {
  answers.forEach((answer) => {
    updatePipingFromAnswer(answer, pages, "Deleted answer");
    section.introductionTitle = updatePipingValue(
      section.introductionTitle,
      answer.id,
      "Deleted answer"
    );
    section.introductionContent = updatePipingValue(
      section.introductionContent,
      answer.id,
      "Deleted answer"
    );
  });
};

const updatePiping = (answers, section, pages) => {
  answers.forEach((answer) => {
    updatePipingFromAnswer(answer, pages, answer.label || "Untitled answer");
    section.introductionTitle = updatePipingValue(
      section.introductionTitle,
      answer.id,
      answer.label || "Untitled answer"
    );
    section.introductionContent = updatePipingValue(
      section.introductionContent,
      answer.id,
      answer.label || "Untitled answer"
    );
  });
};

module.exports = (ctx, section, oldSection) => {
  const oldList =
    getListById(ctx, oldSection?.repeatingSectionListId) ||
    getSupplementaryDataAsCollectionListById(
      ctx,
      oldSection?.repeatingSectionListId
    );
  const newList =
    getListById(ctx, section?.repeatingSectionListId) ||
    getSupplementaryDataAsCollectionListById(
      ctx,
      section?.repeatingSectionListId
    );
  const pages = flatMap(section?.folders, "pages");

  if (
    (!section.repeatingSection && oldSection.repeatingSection) ||
    (oldSection?.repeatingSectionListId &&
      oldSection?.repeatingSectionListId !== section?.repeatingSectionListId)
  ) {
    if (oldList) {
      deletePiping(oldList.answers, section, pages);
    }
  }

  if (
    section.repeatingSection &&
    section.repeatingSectionListId &&
    (oldSection?.repeatingSection !== section?.repeatingSection ||
      oldSection?.repeatingSectionListId !== section?.repeatingSectionListId)
  ) {
    if (newList) {
      updatePiping(newList.answers, section, pages);
    }
  }
};
