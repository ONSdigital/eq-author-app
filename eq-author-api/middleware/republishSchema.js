const { republishSchema } = require("../schema/resolvers/utils")
module.exports = async (req, res, next) => {
  const questionnaireVersionId = req.params.questionnaireVersionId;
  const cirVersion = req.params.cirVersion;

  const result = await republishSchema(questionnaireVersionId, cirVersion);

  res.status(result.success ? 200 : 500).json(result);
}