const loadQuestionnaire = require("../utils/loadQuestionnaire");

module.exports = (logger, context) => (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (questionnaireId) {
    context.questionnaire = JSON.parse(loadQuestionnaire(questionnaireId));
  }
  next();
  return;
};
