#!/usr/bin/env node
//eslint-disable no-loop-func
const {
  getQuestionnaire,
  listQuestionnaires,
  saveQuestionnaire,
} = require("../db/datastore");
const { currentVersion, migrations } = require("../migrations");
const { logger } = require("../utils/logger");

const bulkMigrateDataStore = async () => {
  const questionnaireList = await listQuestionnaires();
  for (let q = 0; q < questionnaireList.length; q++) {
    let latestQuestionnaire = await getQuestionnaire(questionnaireList[q].id);
    if (latestQuestionnaire.version === currentVersion) {
      continue;
    }

    const bringQuestionnaireToLatest = async () => {
      for (let i = latestQuestionnaire.version; i < migrations.length; i++) {
        logger.info(
          `Running migration for version ${migrations[i].name} on ${latestQuestionnaire.id}`
        );
        const migrationFunction = migrations[i];
        latestQuestionnaire = await migrationFunction(latestQuestionnaire);
        latestQuestionnaire.version = i + 1;
      }
      return latestQuestionnaire;
    };

    try {
      await bringQuestionnaireToLatest();
      await saveQuestionnaire(latestQuestionnaire);
    } catch (e) {
      logger.error(e);
    }
  }
};

bulkMigrateDataStore();
