const { getQuestionnaire } = require("../db/datastore");
const { logger } = require("../utils/logger");
const request = require("request");

module.exports = async (req, res) => {
  const CONVERSION_URL = process.env.CONVERSION_URL;
  if (!CONVERSION_URL) {
    res.status(500).json({
      error: "Cannot convert questionnaire without CONVERSION_URL env var set",
    });
  } else {
    const questionnaireId = req.params.questionnaireId;
    const questionnaire = await getQuestionnaire(questionnaireId);

    if (!questionnaire) {
      const error = `Cannot find questionnaire with ID ${questionnaireId}`;
      logger.error(error);
      res.status(404).json({ error });
      return;
    }

    try {
      await request.post(
        `${CONVERSION_URL}`,
        {
          json: questionnaire,
        },
        (err, _, body) => {
          if (err) {
            throw new Error(err);
          }

          res.status(200).json(body);
        }
      );
    } catch (error) {
      logger.error(error);
      res.status(404).json({ error });
    }
  }
};
