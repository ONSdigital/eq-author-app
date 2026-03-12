const { getQuestionnaireByVersionId } = require("../db/datastore");

module.exports = async (req, res) => {
  const questionnaireVersionId = req.params.questionnaireVersionId;

  const questionnaire = await getQuestionnaireByVersionId(
    questionnaireVersionId
  );

  if (!questionnaire) {
    res.status(404).json({});
    return;
  }

  questionnaire.editors = [];
  res.status(200).json(questionnaire);
};
