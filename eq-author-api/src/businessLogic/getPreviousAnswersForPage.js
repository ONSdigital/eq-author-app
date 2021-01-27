const { flatMap, takeWhile, filter, some, compact } = require("lodash/fp");
const { PIPING_ANSWER_TYPES } = require("../../constants/pipingAnswerTypes");

module.exports = (
  questionnaire,
  currentPageId,
  includeSelf = false,
  answerTypes = PIPING_ANSWER_TYPES
) => {
  const allPages = flatMap(
    ({ pages }) => pages,
    flatMap(({ folders }) => folders, questionnaire.sections)
  );
  const allPagesAndConfirmations = flatMap(
    page => (page.confirmation ? [page, page.confirmation] : [page]),
    allPages
  );

  const pagesBeforeCurrent = takeWhile(
    ({ id }) => id !== currentPageId,
    allPagesAndConfirmations
  );

  const currentPage = allPagesAndConfirmations.find(
    ({ id }) => id === currentPageId
  );

  const pagesToInclude = includeSelf
    ? [...pagesBeforeCurrent, currentPage]
    : pagesBeforeCurrent;

  const answers = compact(flatMap(page => page.answers, pagesToInclude));

  return filter(
    answer => some(type => type === answer.type, answerTypes),
    answers
  );
};
