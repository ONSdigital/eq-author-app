const { v4: uuidv4 } = require("uuid");

module.exports = (questionnaire) => {
  if (questionnaire.themes) {
    questionnaire.themeSettings = {
      id: uuidv4(),
      previewTheme: questionnaire.previewTheme,
      themes: questionnaire.themes.map((theme) => ({
        ...theme,
        id: theme.shortName,
      })),
    };

    // Undefined attributes will be removed as part of saveQuestionnaire call
    questionnaire.themes = undefined;
    questionnaire.previewTheme = undefined;
  }

  return questionnaire;
};
