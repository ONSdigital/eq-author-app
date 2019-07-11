const addVersion = require("./addVersion");
const addOptionalFieldProperties = require("./addOptionalFieldProperties");
const addQuestionnaireType = require("./addQuestionnaireType");
const updateMetadataValue = require("./updateMetadataValue");
const addBusinessQuestionnaireIntroduction = require("./addBusinessQuestionnaireIntroduction");
const dropDatatypeFieldFromPipedValues = require("./dropDatatypeFieldFromPipedValues");
const addTotalValidation = require("./addTotalValidation");
const { updateCreatedByToUseUsers } = require("./updateCreatedByToUseUsers");
const addIsPublicFlag = require("./addIsPublicFlag");

const migrations = [
  addVersion,
  addOptionalFieldProperties,
  addQuestionnaireType,
  updateMetadataValue,
  addBusinessQuestionnaireIntroduction,
  dropDatatypeFieldFromPipedValues,
  addTotalValidation,
  updateCreatedByToUseUsers,
  addIsPublicFlag,
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
