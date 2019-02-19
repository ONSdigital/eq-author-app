const { omit, reject } = require("lodash");
const fs = require("fs").promises;
const stringify = require("json-stable-stringify");

const createQuestionnaire = async questionnaire => {
  await fs.writeFile(
    `data/${questionnaire.id}.json`,
    stringify(questionnaire, { space: 4 })
  );
  const questionnaireList = JSON.parse(
    await fs.readFile(`data/QuestionnaireList.json`, "utf8")
  );
  questionnaireList.push({
    ...omit(questionnaire, "sections", "metadata"),
  });
  await fs.writeFile(
    `data/QuestionnaireList.json`,
    stringify(questionnaireList, { space: 4 })
  );
  return questionnaire;
};

const saveQuestionnaire = async questionnaire => {
  await fs.writeFile(
    `data/${questionnaire.id}.json`,
    stringify(questionnaire, { space: 4 })
  );
  return questionnaire;
};

const deleteQuestionnaire = async id => {
  const originalList = JSON.parse(
    await fs.readFile(`data/QuestionnaireList.json`, "utf8")
  );
  await fs.writeFile(
    `data/QuestionnaireList.json`,
    stringify(reject(originalList, { id }), { space: 4 })
  );
};

const getQuestionnaire = async id => {
  const questionnaire = JSON.parse(
    await fs.readFile(`data/${id}.json`, "utf8")
  );
  return Promise.resolve(questionnaire);
};

const listQuestionnaires = async () => {
  return JSON.parse(await fs.readFile(`data/QuestionnaireList.json`, "utf8"));
};

module.exports = {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
};
