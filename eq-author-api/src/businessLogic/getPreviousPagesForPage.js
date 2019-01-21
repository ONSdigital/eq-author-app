const { flatMap, takeWhile, filter, some, concat, find } = require("lodash/fp");
const { ROUTING_ANSWER_TYPES } = require("../../constants/routingAnswerTypes");

module.exports = (
  questionnaire,
  currentPageId,
  includeSelf = false,
  answerTypes = ROUTING_ANSWER_TYPES
) => {
  const allPages = flatMap(section => section.pages, questionnaire.sections);

  const pagesBeforeCurrent = takeWhile(
    page => page.id !== currentPageId,
    allPages
  );

  const currentPage = find({ id: currentPageId }, allPages);
  const pagesToInclude = includeSelf
    ? concat(currentPage, pagesBeforeCurrent)
    : pagesBeforeCurrent;

  return filter(
    pagesToInclude,
    page =>
      page.answers &&
      some(page.answers, answer => answerTypes.includes(answer.type))
  );
};
