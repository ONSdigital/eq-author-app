const { v4: uuidv4 } = require("uuid");

module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    if (!section.hasOwnProperty("folders") && section.hasOwnProperty("pages")) {
      section.folders = section.pages.map((page) => ({
        id: uuidv4(),
        enabled: false,
        alias: "",
        skipConditions: null,
        pages: [page],
      }));

      delete section.pages;
      return section;
    }
  });

  return questionnaire;
};
