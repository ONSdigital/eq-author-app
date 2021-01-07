const {
  flatMap,
  takeWhile,
  filter,
  some,
  concat,
  compact,
} = require("lodash/fp");
const { PIPING_ANSWER_TYPES } = require("../../constants/pipingAnswerTypes");

module.exports = (
  questionnaire,
  currentPageId,
  includeSelf = false,
  answerTypes = PIPING_ANSWER_TYPES
) => {
  const allPages = flatMap(section => section.pages, questionnaire.sections);

  const pagesBeforeCurrent = takeWhile(
    page =>
      page.id !== currentPageId &&
      page.confirmation && page.confirmation.id !== currentPageId,
    allPages
  );

  const currentPage = allPages.find(
    ({ id, confirmation }) =>
      id === currentPageId ||
      (confirmation && confirmation.id === currentPageId)
  );

  const pagesToInclude = includeSelf
    ? concat(currentPage, pagesBeforeCurrent)
    : pagesBeforeCurrent;

  const answers = compact(flatMap(page => page.answers, pagesToInclude));
  return filter(
    answer => some(type => type === answer.type, answerTypes),
    answers
  );
};
