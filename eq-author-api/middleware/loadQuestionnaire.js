const { getQuestionnaire } = require("../utils/datastore");
const { get } = require("lodash");

module.exports = async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (!questionnaireId) {
    next();
    return;
  }

  const questionnaire = await getQuestionnaire(questionnaireId);

  const isAdmin = get(req, "user.admin", false);
  if (isAdmin) {
    req.questionnaire = questionnaire;
    next();
    return;
  }

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
