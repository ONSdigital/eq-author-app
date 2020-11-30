const { last } = require("lodash");

module.exports = ctx => {
  const lastSection = ctx.questionnaire && last(ctx.questionnaire.sections);
  const lastFolder = last(lastSection.folders);
  const lastPage = last(lastFolder.pages);

  if (lastPage && lastPage.routing) {
    delete lastPage.routing;
  }
};
