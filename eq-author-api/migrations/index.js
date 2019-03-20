const addVersion = require("./addVersion");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");
const addQuestionnaireType = require("./addQuestionnaireType");

const migrations = [
  addVersion,
  addOptionalFieldProperties,
  addQuestionnaireType,
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
