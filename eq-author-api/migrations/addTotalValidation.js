const { groupBy } = require("lodash");

const createTotalValidation = require("../src/businessLogic/createTotalValidation");

module.exports = function addTotalValidation(questionnaire) {
  questionnaire.sections.forEach((section) => {
    section.pages.forEach((page) => {
      if (!page.answers) {
        return;
      }
      const answersByType = groupBy(page.answers, (a) => a.type);
      const answerTypes = Object.keys(answersByType);

      let totalValidation = null;
      if (answerTypes.length === 1 && page.answers.length > 1) {
        totalValidation = createTotalValidation({ id: `migrated-${page.id}` });
      }

      page.totalValidation = totalValidation;
    });
  });
  return questionnaire;
};
