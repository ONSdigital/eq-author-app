const { flatMap, takeWhile, filter, some, compact } = require("lodash/fp");
const { PIPING_ANSWER_TYPES } = require("../../constants/pipingAnswerTypes");

module.exports = (
  questionnaire,
  currentPageId,
  includeSelf = false,
  answerTypes = PIPING_ANSWER_TYPES
) => {
  const allPages = flatMap(section => section.pages, questionnaire.sections);
  const allPagesAndConfirmations = allPages.flatMap(page =>
    page.confirmation ? [page, page.confirmation] : [page]
  );

  const pagesBeforeCurrent = takeWhile(
    ({ id }) => id !== currentPageId,
    allPagesAndConfirmations
  );

  const currentPage = allPagesAndConfirmations.find(
    ({ id }) => id === currentPageId
  );

  const pagesToInclude = includeSelf
    ? [currentPage, ...pagesBeforeCurrent]
    : pagesBeforeCurrent;

  const answers = compact(flatMap(page => page.answers, pagesToInclude));

  return filter(
    answer => some(type => type === answer.type, answerTypes),
    answers
  );
};
