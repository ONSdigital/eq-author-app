module.exports = (questionnaire) => {
  questionnaire.themeSettings.themes.forEach((theme) => {
    if (theme.shortName === "beis") {
      theme.shortName = "dbt-dsit";
      theme.id = "dbt-dsit";
    }
    if (theme.shortName === "beis_ni") {
      theme.shortName = "dbt_ni";
      theme.id = "dbt_ni";
    }
  });

  if (questionnaire.themeSettings.previewTheme === "beis") {
    questionnaire.themeSettings.previewTheme = "dbt-dsit";
  }
  if (questionnaire.themeSettings.previewTheme === "beis_ni") {
    questionnaire.themeSettings.previewTheme = "dbt-dsit_ni";
  }
  return questionnaire;
};
