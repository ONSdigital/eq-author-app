const { v4: uuidv4 } = require("uuid");

module.exports = function addFolders(questionnaire) {
  const { sections } = questionnaire;

  const folders = sections.map(section => {
    if (!section.hasOwnProperty("folders") && section.hasOwnProperty("pages")) {
      section.folders = section.pages.map(page => ({
        id: uuidv4(),
        enabled: false,
        alias: "",
        skipConditions: null,
        pages: [page],
      }));

      delete section.pages;
      return section;
    } else {
      return section;
    }
  });

  questionnaire.sections = folders;

  return questionnaire;
};
