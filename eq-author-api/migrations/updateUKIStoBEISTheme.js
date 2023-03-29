module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "ukis") {
      theme.shortName = "beis";
      theme.id = "beis";
    }
    if (theme.shortName === "ukis_ni") {
      theme.shortName = "beis_ni";
      theme.id = "beis_ni";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "ukis") {
    questionnaire.themeSettings.previewTheme = "beis";
  }
  if (questionnaire.themeSettings.previewTheme === "ukis_ni") {
    questionnaire.themeSettings.previewTheme = "beis_ni";
  }
  return questionnaire;
};
