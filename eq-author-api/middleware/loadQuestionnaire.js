const { QuestionnanaireVersionsModel } = require("../db/models/DynamoDB");

module.exports = (logger, context) => async (req, res, next) => {
  const questionnaireId = req.header("questionnaireId");
  if (questionnaireId) {
    context.questionnaire = await new Promise((resolve, _) => {
      QuestionnanaireVersionsModel.queryOne({ id: { eq: questionnaireId } })
        .descending()
        .exec((err, questionnaire) => {
          if (err) {
            return console.log(err);
          }
          if (!questionnaire.metadata) {
            questionnaire.metadata = [];
          }
          resolve(questionnaire);
        });
    });
  }
  next();
  return;
};
