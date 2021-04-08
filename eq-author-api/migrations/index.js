const migrations = [
  require("./addVersion"),
  require("./addOptionalFieldProperties"),
  require("./addQuestionnaireType"),
  require("./updateMetadataValue"),
  require("./addBusinessQuestionnaireIntroduction"),
  require("./dropDatatypeFieldFromPipedValues"),
  require("./addTotalValidation"),
  require("./updateCreatedByToUseUsers"),
  require("./addIsPublicFlag"),
  require("./addExpressionOperator"),
  require("./addPublishStatusToQuestionnaire"),
  require("./addHistoryToQuestionnaire"),
  require("./addTypeToHistoryEvent"),
  require("./updateDefaultTextAreaLength"),
  require("./addFolders"),
  require("./addGuidancePanelSwitch"),
  require("./addDefaultTheme"),
  require("./addLockedStatus"),
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
