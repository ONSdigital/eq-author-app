const { flatMap, takeWhile, filter, some } = require("lodash/fp");
const { PIPING_ANSWER_TYPES } = require("../../constants/pipingAnswerTypes");

module.exports = (questionnaire, currentSectionId) => {
  const sections = takeWhile(
    section => section.id !== currentSectionId,
    questionnaire.sections
  );

  const previousSectionPages = flatMap(section => section.pages, sections);

  const answers = flatMap(page => page.answers, previousSectionPages);

  return filter(
    answer => some(type => type === answer.type, PIPING_ANSWER_TYPES),
    answers
  );
};
