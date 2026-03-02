const { getQuestionnaireByVersionId } = require("../db/datastore");

module.exports = async (req, res) => {
  const versionId = req.params.versionId;

  const questionnaire = await getQuestionnaireByVersionId(
    versionId
  );

  if (!questionnaire) {
    res.status(404).json({});
    return;
  }

  questionnaire.editors = [];
  res.status(200).json(questionnaire);
};
