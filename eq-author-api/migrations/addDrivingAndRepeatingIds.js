const { getPages } = require("../schema/resolvers/utils");
const { v4: uuidv4 } = require("uuid");

module.exports = (questionnaire) => {
  const ctx = { questionnaire };
  const pages = getPages(ctx);

  pages.forEach((page) => {
    if (page.pageType === "ListCollectorPage") {
      if (!page.drivingId) {
        page.drivingId = uuidv4();
      }
      if (!page.anotherId) {
        page.anotherId = uuidv4();
      }
    }
  });

  return questionnaire;
};
