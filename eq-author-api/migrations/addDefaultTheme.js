const { createTheme } = require("../src/businessLogic");

module.exports = (questionnaire) => {
  if (!questionnaire.previewTheme || !questionnaire.themes) {
    const isBusinessSurvey = questionnaire.introduction; // May need different heuristic in future if socials get intros
    const currentLegalBasis =
      isBusinessSurvey && questionnaire.introduction.legalBasis;

    const defaultTheme = createTheme({
      legalBasisCode: currentLegalBasis || "NOTICE_1",
      shortName: isBusinessSurvey ? "default" : "social",
    });

    questionnaire.previewTheme = defaultTheme.shortName;
    questionnaire.themes = [defaultTheme];
  }

  return questionnaire;
};
