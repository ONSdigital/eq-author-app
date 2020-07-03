const { flatMap, compact } = require("lodash");

const getAllAnswers = questionnaire =>
  flatMap(questionnaire.sections, section =>
    compact(flatMap(section.pages, page => page.answers))
  );

const getAnswerById = (questionnaire, answerId) =>
  getAllAnswers(questionnaire).find(answer => answer.id === answerId);

module.exports = { getAnswerById, getAllAnswers };
