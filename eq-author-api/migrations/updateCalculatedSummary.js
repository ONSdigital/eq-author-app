const { getPages } = require("../schema/resolvers/utils");
const { v4: uuidv4 } = require("uuid");

module.exports = (questionnaire) => {
  const ctx = {
    questionnaire,
  };
  const pages = getPages(ctx);

  pages.forEach((page) => {
    if (page.pageType === "CalculatedSummaryPage") {
      if (page.answers?.length > 0) {
        return;
      }
      page.answers = [
        {
          id: uuidv4(),
          label: page.totalTitle ? page.totalTitle : "",
          type: page.type ? page.type : "Number",
          validation: {},
          properties: {},
        },
      ];
    }
  });
  return questionnaire;
};
