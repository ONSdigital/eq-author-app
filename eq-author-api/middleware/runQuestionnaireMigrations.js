const { saveQuestionnaire } = require("../utils/datastore");

module.exports = logger => migrations => async (req, res, next) => {
  if (!req.questionnaire) {
    next();
    return;
  }

  if (req.questionnaire.version === migrations.length) {
    next();
    return;
  }

  try {
    req.questionnaire = await migrations
      .slice(req.questionnaire.version)
      .reduce((questionnaire, migration, index) => {
        logger.info(`Running migration ${index} on ${questionnaire.id}`);
        return migration(questionnaire);
      }, req.questionnaire);

    req.questionnaire.version = migrations.length;
    await saveQuestionnaire(req.questionnaire);
    next();
  } catch (e) {
    logger.info(`Running migration failed: `, e);
    next();
  }
};
