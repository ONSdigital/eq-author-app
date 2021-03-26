const getThemeByShortName = ({ questionnaire }, shortName) =>
  questionnaire.themes.find((theme) => theme.shortName === shortName);

module.exports = {
  getThemeByShortName,
};
