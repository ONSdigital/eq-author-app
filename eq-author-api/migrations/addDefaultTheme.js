const { createTheme } = require("../schema/resolvers/utils/theme");

module.exports = (questionnaire) => {
  if (!questionnaire.previewTheme || !questionnaire.themes) {
    const currentLegalBasis =
      questionnaire.introduction && questionnaire.introduction.legalBasis;

    const defaultTheme = createTheme({
      legalBasisCode: currentLegalBasis || "NOTICE_1",
    });

    questionnaire.previewTheme = defaultTheme.shortName;
    questionnaire.themes = [defaultTheme];
  }

  return questionnaire;
};
