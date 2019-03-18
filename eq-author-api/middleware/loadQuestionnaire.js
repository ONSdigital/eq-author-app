const { getQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (!questionnaireId) {
    next();
    return;
  }
  const questionnaire = await getQuestionnaire(questionnaireId);
  req.questionnaire = questionnaire;
  if (!questionnaire) {
    next();
    return;
  }

  if (!questionnaire.metadata) {
    questionnaire.metadata = [];
  }
  if (!questionnaire.sections) {
    questionnaire.sections = [];
  }
  next();
};
