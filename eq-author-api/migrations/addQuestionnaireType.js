const { SOCIAL } = require("../constants/questionnaireTypes");
module.exports = function addQuestionnaireType(questionnaire) {
  if (!questionnaire.type) {
    questionnaire.type = SOCIAL;
  }

  return questionnaire;
};
