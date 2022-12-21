const { getPages, getConfirmations } = require("../schema/resolvers/utils");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const pages = getPages(ctx);

  const confirmations = getConfirmations(ctx);

  questionnaire.sections.forEach((section) => {
    if (section.pageDescription === undefined) {
      section.pageDescription = null;
    }
  });

  pages.forEach((page) => {
    if (page.pageDescription === undefined) {
      page.pageDescription = null;
    }
    if (
      page.pageType === "ListCollectorPage" &&
      page.addItemPageDescription === undefined
    ) {
      if (page.addItemPageDescription === undefined) {
        page.addItemPageDescription = null;
      }
      if (page.anotherPageDescription === undefined) {
        page.anotherPageDescription = null;
      }
    }
  });

  confirmations.forEach((confirmation) => {
    if (confirmation.pageDescription === undefined) {
      confirmation.pageDescription = null;
    }
  });

  return questionnaire;
};
