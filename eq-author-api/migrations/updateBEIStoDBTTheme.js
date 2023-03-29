module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "beis") {
      theme.shortName = "dbt_dsit";
      theme.id = "dbt_dsit";
    }
    if (theme.shortName === "beis_ni") {
      theme.shortName = "dbt_dsit_ni";
      theme.id = "dbt_dsit_ni";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "beis") {
    questionnaire.themeSettings.previewTheme = "dbt_dsit";
  }
  if (questionnaire.themeSettings.previewTheme === "beis_ni") {
    questionnaire.themeSettings.previewTheme = "dbt_dsit_ni";
  }
  return questionnaire;
};
