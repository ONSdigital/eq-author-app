const {
  saveQuestionnaire,
  getQuestionnaireMetaById,
} = require("../db/datastore");
const { merge } = require("lodash");

module.exports =
  (logger) =>
  ({ currentVersion, migrations }) =>
  async (req, res, next) => {
    if (!req.questionnaire || req.questionnaire.version === currentVersion) {
      return next();
    }

    try {
      const questionnaireMeta = await getQuestionnaireMetaById(
        req.questionnaire.id
      );
      merge(questionnaireMeta, { ...req.questionnaire });
      req.questionnaire = questionnaireMeta;
      const migrationsToRun = migrations.slice(req.questionnaire.version);
      for (let migration of migrationsToRun) {
        logger.info(
          `Running migration for version ${migration.name} on ${req.questionnaire.id}`
        );
        req.questionnaire = await migration(req.questionnaire);
      }
      req.questionnaire.version = currentVersion;
      await saveQuestionnaire(req.questionnaire);
      next();
    } catch (e) {
      logger.error(e);
      next(e);
    }
  };
