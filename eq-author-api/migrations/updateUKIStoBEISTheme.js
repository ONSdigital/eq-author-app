module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "ukis") {
      theme.shortName = "dbt";
      theme.id = "dbt";
    }
    if (theme.shortName === "ukis_ni") {
      theme.shortName = "dbt_ni";
      theme.id = "dbt_ni";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "ukis") {
    questionnaire.themeSettings.previewTheme = "dbt";
  }
  if (questionnaire.themeSettings.previewTheme === "ukis_ni") {
    questionnaire.themeSettings.previewTheme = "dbt_ni";
  }
  return questionnaire;
};
