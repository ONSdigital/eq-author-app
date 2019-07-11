#!/usr/bin/env node
/* eslint-disable import/unambiguous,no-console */

const {
  getQuestionnaire,
  listQuestionnaires,
  saveQuestionnaire,
} = require("../utils/datastore");
const { currentVersion, migrations } = require("../migrations");

const bulkMigrateDataStore = async () => {
  const questionnaireList = await listQuestionnaires();
  for (let q = 0; q < questionnaireList.length; q++) {
    let latestQuestionnaire = await getQuestionnaire(questionnaireList[q].id);
    if (latestQuestionnaire.version === currentVersion) {
      continue;
    }

    const bringQuestionnaireToLatest = async () => {
      for (let i = latestQuestionnaire.version; i < migrations.length; i++) {
        console.log(
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
      console.log(e);
    }
  }
};

bulkMigrateDataStore();
