#!/usr/bin/env node
/* eslint-disable import/unambiguous,no-console */
const fs = require("fs");
const jsonPath = process.env.DATA_DIR;
const { createQuestionnaire } = require("../utils/datastore");

if (!jsonPath) {
  throw new Error("Set DATA_DIR environment variable");
}

const importQuestionnaire = async contents => {
  return createQuestionnaire({ ...contents, id: contents.id + "_copy" });
};

const loadQuestionnaireJSON = async path => {
  const contents = JSON.parse(fs.readFileSync(path, "utf-8"));
  await importQuestionnaire(contents);
};

fs.readdir(jsonPath, async function(err, items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i][0] !== "." && items[i] !== "QuestionnaireList.json") {
      await loadQuestionnaireJSON(`${jsonPath}/${items[i]}`);
    }
  }
});
