module.exports = (questionnaire) => {
  const existingLegalBasis = questionnaire?.introduction?.legalBasis;

  if (existingLegalBasis) {
    questionnaire.themeSettings.themes.forEach(
      (theme) => (theme.legalBasisCode = existingLegalBasis)
    );
  }

  return questionnaire;
};
