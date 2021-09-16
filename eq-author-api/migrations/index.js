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
  require("./addQuestionnaireQcodes"),
  require("./addThemeSettings"),
  require("./copyLegalBasisToThemes"),
  require("./addSectionHubSettings"),
  require("./updateExpressionSchema"),
  require("./upateAnswerWithAdvancedProperty"),
  require("./updateUKISEPEThemes"),
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
