const { last } = require("lodash");

module.exports = ctx => {
  const lastSection = ctx.questionnaire && last(ctx.questionnaire.sections);
  const lastFolder = lastSection && last(lastSection.folders);
  const lastPage = lastFolder && last(lastFolder.pages);

  if (lastPage && lastPage.routing) {
    delete lastPage.routing;
  }
};
