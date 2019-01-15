const { isNil } = require("lodash/fp");
const loadQuestionnaire = require("../utils/loadQuestionnaire");

module.exports = (logger, context) => (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (isNil(questionnaireId)) {
    logger.error("Request must contain a valid questionnaireId header.");
    res.send(401);
    return;
  }

  context.questionnaire = JSON.parse(loadQuestionnaire(questionnaireId));
  next();
  return;
};
