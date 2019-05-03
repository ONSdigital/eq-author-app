const addVersion = require("./addVersion");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");
const addQuestionnaireType = require("./addQuestionnaireType");
const updateMetadataValue = require("./updateMetadataValue");
const addBusinessQuestionnaireIntroduction = require("./addBusinessQuestionnaireIntroduction");
const dropDatatypeFieldFromPipedValues = require("./dropDatatypeFieldFromPipedValues");
const addTotalValidation = require("./addTotalValidation");
const { updateCreatedByToUseUsers } = require("./updateCreatedByToUseUsers");

const migrations = [
  addVersion,
  addOptionalFieldProperties,
  addQuestionnaireType,
  updateMetadataValue,
  addBusinessQuestionnaireIntroduction,
  dropDatatypeFieldFromPipedValues,
  addTotalValidation,
  updateCreatedByToUseUsers,
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
