const { getQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (!questionnaireId) {
    next();
    return;
  }

  const questionnaire = await getQuestionnaire(questionnaireId);

  if (questionnaire && questionnaire.isPublic === false) {
    const userId = req.user.id;
    const authorizedUsers = [questionnaire.createdBy, ...questionnaire.editors];

    if (!authorizedUsers.includes(userId)) {
      res.status(403).send("Unauthorized questionnaire access");
      return;
    }
  }

  req.questionnaire = questionnaire;
  next();
};
