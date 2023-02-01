module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "default") {
      theme.shortName = "business";
      theme.id = "business";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "default") {
    questionnaire.themeSettings.previewTheme = "business";
  }

  if (questionnaire.theme === "default") {
    questionnaire.theme = "business";
  }
  return questionnaire;
};
