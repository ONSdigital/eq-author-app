const { getQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (questionnaireId) {
    req.questionnaire = await getQuestionnaire(questionnaireId);
    if (!req.questionnaire.metadata) {
      req.questionnaire.metadata = [];
    }
    if (!req.questionnaire.sections) {
      req.questionnaire.sections = [];
    }
  }
  next();
};
