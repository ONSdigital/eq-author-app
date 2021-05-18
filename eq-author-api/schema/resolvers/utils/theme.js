const getThemeByShortName = ({ questionnaire }, shortName) =>
  questionnaire.themeSettings.themes.find(
    (theme) => theme.shortName === shortName
  );

module.exports = {
  getThemeByShortName,
};
