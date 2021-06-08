export const getThemeSettingsErrorCount = (questionnaire) =>
  questionnaire?.themeSettings?.validationErrorInfo?.totalCount +
    questionnaire?.validationErrorInfo?.totalCount || 0;
