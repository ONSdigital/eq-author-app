const {
  saveQuestionnaire,
  getQuestionnaireMetaById,
} = require("../utils/datastore");
const { merge } = require("lodash");

module.exports = logger => ({ currentVersion, migrations }) => async (
  req,
  res,
  next
) => {
  if (!req.questionnaire) {
    next();
    return;
  }

  if (req.questionnaire.version === currentVersion) {
    next();
    return;
  }

  try {
    const questionnaireMeta = await getQuestionnaireMetaById(
      req.questionnaire.id
    );
    merge(questionnaireMeta, { ...req.questionnaire });
    req.questionnaire = questionnaireMeta;
    req.questionnaire = await migrations
      .slice(req.questionnaire.version)
      .reduce((questionnaire, migration) => {
        logger.info(
          `Running migration for version ${migration.name} on ${questionnaire.id}`
        );
        return migration(questionnaire);
      }, req.questionnaire);

    req.questionnaire.version = currentVersion;
    await saveQuestionnaire(req.questionnaire);
    next();
  } catch (e) {
    logger.error(e);
    next(e);
  }
};
