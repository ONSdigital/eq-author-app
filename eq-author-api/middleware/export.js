const { getQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res) => {
  const questionnaireId = req.params.questionnaireId;
  const questionnaire = await getQuestionnaire(questionnaireId);

  res.status(200).json(questionnaire);
};
