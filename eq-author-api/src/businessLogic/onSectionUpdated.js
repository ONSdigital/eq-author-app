const { getListById } = require("../../schema/resolvers/utils");
const { flatMap } = require("lodash");
const cheerio = require("cheerio");

const updatePipingVaue = (htmlText, answerId, newValue) => {
  const htmlDoc = cheerio.load(htmlText, null, false);
  const dataSpan = htmlDoc(`span[data-id=${answerId}]`);
  dataSpan.each((i, elem) => {
    elem.children[0].data = `[${newValue}]`;
  });
  return htmlDoc.html();
};

const updatePipingFromAnswer = (answer, pages, newValue) => {
  pages.forEach((page) => {
    page.title = updatePipingVaue(page.title, answer.id, newValue);
    page.description = updatePipingVaue(page.description, answer.id, newValue);
  });
  return pages;
};

const deletePiping = (answers, pages) => {
  answers.forEach((answer) => {
    updatePipingFromAnswer(answer, pages, "Deleted answer");
  });
};

const updatePiping = (answers, pages) => {
  answers.forEach((answer) => {
    updatePipingFromAnswer(answer, pages, answer.label || "Untitled answer");
  });
};

module.exports = (ctx, section, oldSection) => {
  const oldList = getListById(ctx, oldSection?.repeatingSectionListId);
  const newList = getListById(ctx, section?.repeatingSectionListId);
  const pages = flatMap(section?.folders, "pages");

  if (
    (!section.repeatingSection && oldSection.repeatingSection) ||
    (oldSection?.repeatingSectionListId &&
      oldSection?.repeatingSectionListId !== section?.repeatingSectionListId)
  ) {
    deletePiping(oldList.answers, pages);
  }

  if (
    section.repeatingSection &&
    section.repeatingSectionListId &&
    (oldSection?.repeatingSection !== section?.repeatingSection ||
      oldSection?.repeatingSectionListId !== section?.repeatingSectionListId)
  ) {
    updatePiping(newList.answers, pages);
  }
};
