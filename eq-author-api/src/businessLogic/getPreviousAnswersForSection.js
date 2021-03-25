const { flatMap, takeWhile, filter, some, compact } = require("lodash/fp");
const { PIPING_ANSWER_TYPES } = require("../../constants/pipingAnswerTypes");
const { getPagesFromSection } = require("../../schema/resolvers/utils/utils");

module.exports = (questionnaire, currentSectionId) => {
  const sections = takeWhile(
    (section) => section.id !== currentSectionId,
    questionnaire.sections
  );

  const previousSectionPages = flatMap(
    (section) => getPagesFromSection(section),
    sections
  );

  const answers = compact(
    flatMap((page) => page.answers, previousSectionPages)
  );
  return filter(
    (answer) => some((type) => type === answer.type, PIPING_ANSWER_TYPES),
    answers
  );
};
