const { getPages } = require("../../schema/resolvers/utils/utils");
const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");

const onPageDeleted = (ctx, section, removedPage) => {
  const allPages = getPages(ctx);

  if (removedPage.answers) {
    removedPage.answers.forEach((answer) => {
      onAnswerDeleted(ctx, removedPage, answer);
    });
  }

  allPages.forEach((page) => {
    if (!page.routing) {
      return;
    }

    const elseRoute = page.routing.else;
    if (elseRoute.pageId === removedPage.id) {
      elseRoute.pageId = null;
    }

    page.routing.rules.map((rule) => {
      if (rule.destination.pageId === removedPage.id) {
        rule.destination.pageId = null;
      }
    });
  });
};

module.exports = onPageDeleted;
