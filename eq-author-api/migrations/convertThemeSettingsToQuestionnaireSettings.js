module.exports = (questionnaire) => {
  const selectedTheme = questionnaire?.themeSettings?.themes?.find(
    (theme) => theme.id === questionnaire.themeSettings.previewTheme
  );

  if (selectedTheme) {
    questionnaire.formType = selectedTheme.formType;
    questionnaire.eqId = selectedTheme.eqId;
    questionnaire.theme = questionnaire.themeSettings.previewTheme;
    questionnaire.legalBasis = selectedTheme.legalBasisCode;
  }

  questionnaire.themeSettings = undefined;

  return questionnaire;
};
