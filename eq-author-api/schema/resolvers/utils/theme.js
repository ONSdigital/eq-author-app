const getThemeByShortName = ({ questionnaire }, shortName) =>
  questionnaire.themeSettings.themes.find(
    (theme) => theme.shortName === shortName
  );

const getPreviewTheme = ({ questionnaire }) =>
  questionnaire.themeSettings.previewTheme || null;

const getFirstEnabledTheme = ({ questionnaire }) =>
  questionnaire.themeSettings.themes.find(({ enabled }) => enabled === true);

module.exports = {
  getThemeByShortName,
  getPreviewTheme,
  getFirstEnabledTheme,
};
