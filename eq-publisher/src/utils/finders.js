const { filter, flatMap, compact } = require("lodash");

const getAllAnswers = questionnaire =>
  flatMap(questionnaire.sections, section =>
    compact(flatMap(section.pages, page => page.answers))
  );

const getAnswerByOptionId = (questionnaire, optionId) => {
  const answers = getAllAnswers(questionnaire);
  for (const answer of answers) {
    if (filter(answer.options, option => option.id === optionId).length) {
      return answer;
    }
    if (answer.mutuallyExclusiveOption.id === optionId) {
      return answer;
    }
  }
};

const getAnswerById = (questionnaire, answerId) =>
  getAllAnswers(questionnaire).find(answer => answer.id === answerId);

module.exports = { getAnswerByOptionId, getAnswerById, getAllAnswers };
