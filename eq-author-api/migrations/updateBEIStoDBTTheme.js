module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "beis") {
      theme.shortName = "dbt";
      theme.id = "dbt";
    }
    if (theme.shortName === "beis_ni") {
      theme.shortName = "dbt_ni";
      theme.id = "dbt_ni";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "beis") {
    questionnaire.themeSettings.previewTheme = "dbt";
  }
  if (questionnaire.themeSettings.previewTheme === "beis_ni") {
    questionnaire.themeSettings.previewTheme = "dbt_ni";
  }
  return questionnaire;
};
