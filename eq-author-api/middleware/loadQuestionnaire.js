const { getQuestionnaire } = require("../utils/datastore");

module.exports = (logger, context) => async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (questionnaireId) {
    context.questionnaire = await getQuestionnaire(questionnaireId);
    if (!context.questionnaire.metadata) {
      context.questionnaire.metadata = [];
    }
    if (!context.questionnaire.sections) {
      context.questionnaire.sections = [];
    }
  }
  next();
};
