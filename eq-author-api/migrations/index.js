const addVersion = require("./addVersion");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");
const addQuestionnaireType = require("./addQuestionnaireType");
const updateMetadataValue = require("./updateMetadataValue");

const migrations = [
  addVersion,
  addOptionalFieldProperties,
  addQuestionnaireType,
  updateMetadataValue,
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
