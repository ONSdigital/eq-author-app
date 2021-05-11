const { v4: uuidv4 } = require("uuid");

module.exports = (questionnaire) => {
  if (questionnaire.themes) {
    questionnaire.themeSettings = {
      id: uuidv4(),
      previewTheme: questionnaire.previewTheme,
      themes: [...questionnaire.themes],
    };
    delete questionnaire.themes;
    delete questionnaire.previewTheme;
  }

  return questionnaire;
};
