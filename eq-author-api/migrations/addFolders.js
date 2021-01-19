const { v4: uuidv4 } = require("uuid");

module.exports = function addFolders(questionnaire) {
  const { sections } = questionnaire;

  const folders = sections.map(section => {
    if (!section.hasOwnProperty("folders") && section.hasOwnProperty("pages")) {
      const pages = section.pages;
      section.folders = [
        {
          id: uuidv4(),
          alias: "",
          enabled: false,
          pages,
          skipConditions: null,
        },
      ];
      delete section.pages;
      return section;
    } else {
      return section;
    }
  });

  questionnaire.sections = folders;

  return questionnaire;
};
