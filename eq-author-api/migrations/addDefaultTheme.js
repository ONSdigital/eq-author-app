const { createTheme } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  if (!questionnaire.previewTheme || !questionnaire.themes) {
    const defaultTheme = createTheme();

    questionnaire.previewTheme = defaultTheme.shortName;
    questionnaire.themes = [defaultTheme];
  }

  return questionnaire;
};
