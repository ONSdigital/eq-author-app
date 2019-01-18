const { flatMap, takeWhile, filter, some, concat, find } = require("lodash/fp");
const { PIPING_ANSWER_TYPES } = require("../../constants/pipingAnswerTypes");

module.exports = (questionnaire, currentPageId, includeSelf = false) => {
  const allPages = flatMap(section => section.pages, questionnaire.sections);

  const pagesBeforeCurrent = takeWhile(
    page => page.id !== currentPageId,
    allPages
  );

  const currentPage = find({ id: currentPageId }, allPages);
  const pagesToInclude = includeSelf
    ? concat(currentPage, pagesBeforeCurrent)
    : pagesBeforeCurrent;

  const answers = flatMap(page => page.answers, pagesToInclude);

  return filter(
    answer => some(type => type === answer.type, PIPING_ANSWER_TYPES),
    answers
  );
};
