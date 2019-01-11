const { omit, reject } = require("lodash");
const fs = require("fs").promises;
const stringify = require("json-stable-stringify");

const dataDir = process.env.DATA_DIR || "data";

const createQuestionnaire = async questionnaire => {
  await fs.writeFile(
    `${dataDir}/${questionnaire.id}.json`,
    stringify(questionnaire, { space: 4 })
  );
  const questionnaireList = JSON.parse(
    await fs.readFile(`${dataDir}/QuestionnaireList.json`, "utf8")
  );
  questionnaireList.push({
    ...omit(questionnaire, "sections", "metadata"),
  });
  await fs.writeFile(
    `${dataDir}/QuestionnaireList.json`,
    stringify(questionnaireList, { space: 4 })
  );
  return questionnaire;
};

const saveQuestionnaire = async questionnaire => {
  await fs.writeFile(
    `${dataDir}/${questionnaire.id}.json`,
    stringify(questionnaire, { space: 4 })
  );
  return questionnaire;
};

const deleteQuestionnaire = async id => {
  const originalList = JSON.parse(
    await fs.readFile(`${dataDir}/QuestionnaireList.json`, "utf8")
  );
  await fs.writeFile(
    `${dataDir}/QuestionnaireList.json`,
    stringify(reject(originalList, { id }), { space: 4 })
  );

  await fs.unlink(`data/${id}.json`);
};

const getQuestionnaire = async id => {
  const questionnaire = JSON.parse(
    await fs.readFile(`${dataDir}/${id}.json`, "utf8")
  );
  return Promise.resolve(questionnaire);
};

const listQuestionnaires = async () => {
  return JSON.parse(
    await fs.readFile(`${dataDir}/QuestionnaireList.json`, "utf8")
  );
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
};
