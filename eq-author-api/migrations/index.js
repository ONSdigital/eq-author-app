const addVersion = require("./addVersion");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");
const addQuestionnaireType = require("./addQuestionnaireType");
const updateMetadataValue = require("./updateMetadataValue");
const addBusinessQuestionnaireIntroduction = require("./addBusinessQuestionnaireIntroduction");

const migrations = [
  addVersion,
  addOptionalFieldProperties,
  addQuestionnaireType,
  updateMetadataValue,
  addBusinessQuestionnaireIntroduction,
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
