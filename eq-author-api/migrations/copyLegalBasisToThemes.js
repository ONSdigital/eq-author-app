module.exports = (questionnaire) => {
  if (questionnaire?.legalBasis) {
    questionnaire.themeSettings.themes.forEach(
      (theme) => (theme.legalBasisCode = questionnaire.legalBasis)
    );
  }

  return questionnaire;
};
