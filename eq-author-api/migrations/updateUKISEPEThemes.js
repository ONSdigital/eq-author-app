module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.map((theme) => {
    if (theme.shortCode === "epeni") {
      theme.shortCode = "epenorthernireland";
    }
    if (theme.shortCode === "ukisni") {
      theme.shortCode = "ukis_ni";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "epeni") {
    questionnaire.themeSettings.previewTheme = "epenorthernireland";
  }
  if (questionnaire.themeSettings.previewTheme === "ukisni") {
    questionnaire.themeSettings.previewTheme = "ukis_ni";
  }

  return questionnaire;
};
