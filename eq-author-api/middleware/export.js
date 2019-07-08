const { getQuestionnaire } = require("../utils/datastore");

module.exports = async (req, res) => {
  const questionnaireId = req.params.questionnaireId;
  const questionnaire = await getQuestionnaire(questionnaireId);

  if (!questionnaire) {
    res.status(404).json({});
    return;
  }

  questionnaire.editors = [];
  res.status(200).json(questionnaire);
};
