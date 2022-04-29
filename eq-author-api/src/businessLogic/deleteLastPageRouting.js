const { last } = require("lodash");
const { logger } = require("../../utils/logger");

module.exports = (ctx) => {
  const lastSection = ctx.questionnaire && last(ctx.questionnaire.sections);
  const lastFolder = lastSection && last(lastSection.folders);
  const lastPage = lastFolder && last(lastFolder.pages);

  if (lastPage && lastPage.routing) {
    logger.info(
      `Removed Last Page Routing ${JSON.stringify(lastPage.routing)}`
    );

    delete lastPage.routing;
  }
};
