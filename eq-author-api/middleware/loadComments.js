const { getCommentsForQuestionnaire } = require("../db/datastore");

module.exports = async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (!questionnaireId) {
    next();
    return;
  }

  const { comments } = await getCommentsForQuestionnaire(questionnaireId);

  req.comments = comments;
  next();
};
