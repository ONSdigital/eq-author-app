const { getPages } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const pages = getPages(ctx);

  questionnaire.sections.forEach((section) => {
    if (section.pageDescription === undefined) {
      section.pageDescription = null;
    }
  });

  pages.forEach((page) => {
    if (page.pageDescription === undefined) {
      page.pageDescription = null;
    }
  });

  return questionnaire;
};
