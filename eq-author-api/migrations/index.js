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
  require("./updateAnswerDeletedMetaData"),
  require("./updateUKISEPEThemes"),
  require("./updateContactDetails"),
  require("./addSubmissionPage"),
  require("./migrateFolder"),
  require("./addSummaryTitle"),
  require("./addCollectionLists"),
  require("./updateCommentsReadByEditors"),
  require("./updateEnabledHub"),
  require("./updateEnabledHubAWSFix"),
  require("./updateEnabledHubAWSFixTwo"),
  require("./convertMutuallyExclusiveOptions"),
  require("./updateCalculatedSummary"),
  require("./updateMutuallyExclusive"),
  require("./addDataVersion"),
  require("./updateUKIStoBEISTheme"),
  require("./updateDefaultToBusinessTheme"),
  require("./addPageDescription"),
  require("./convertThemeSettingsToQuestionnaireSettings"),
  require("./updateBEIStoDBTTheme"),
  require("./convertSectionPageDescription"),
  require("./updateIntroductionEnabledWithValidation"),
  require("./addRepeatingLabelAndInputFields"),
  require("./addCollectionListAnswerRepeatingProperties"),
  require("./updateIntroductionPreviewQuestionsSettings"),
  require("./convertListCollectorPageToFolder"),
  require("./addValidationToListCollectorAnswers"),
  require("./addFieldsToListCollectorFolderContents"),
  require("./addAdditonalContentsToAddItemPage"),
  require("./updateHealthThemeToPandemicMonitoring"),
];

const currentVersion = migrations.length;

module.exports = {
  migrations,
  currentVersion,
};
