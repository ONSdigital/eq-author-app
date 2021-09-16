module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "epeni") {
      theme.shortName = "epenorthernireland";
      theme.id = "epenorthernireland";
    }
    if (theme.shortName === "ukisni") {
      theme.shortName = "ukis_ni";
      theme.id = "ukis_ni";
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
