const { getQuestionnaireMetaById, saveModel } = require("../utils/datastore");
const { QuestionnaireModel } = require("../db/models/DynamoDB");

module.exports = async function addTypeToHistoryEvent(questionnaire) {
  const metadata = await getQuestionnaireMetaById(questionnaire.id);

  metadata.history.map(item => {
    if (!item.type) {
      item.type = item.hasOwnProperty("bodyText") ? "note" : "system";
    }
    return item;
  });

  await saveModel(new QuestionnaireModel(metadata));

  return questionnaire;
};
