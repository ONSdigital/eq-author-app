const { getQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (!questionnaireId) {
    next();
    return;
  }
  req.questionnaire = await getQuestionnaire(questionnaireId);
  next();
};
