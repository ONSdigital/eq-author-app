const {
  getPages,
  getSectionByPageId,
} = require("../../schema/resolvers/utils");
const { NEXT_PAGE } = require("../../constants/logicalDestinations");
const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");

const onPageDeleted = (ctx, removedPage) => {
  const allPages = getPages(ctx);
  const sectionId = getSectionByPageId(ctx, removedPage.id).id;
  removedPage.answers.forEach(answer => {
    onAnswerDeleted(ctx, removedPage, answer);
  });

  allPages.forEach(page => {
    if (!page.routing) {
      return;
    }

    const elseRoute = page.routing.else;
    if (
      elseRoute.pageId === removedPage.id ||
      elseRoute.sectionId === sectionId
    ) {
      elseRoute.sectionId = null;
      elseRoute.pageId = null;
      elseRoute.logical = NEXT_PAGE;
    }

    const validRules = page.routing.rules.filter(
      rule =>
        rule.destination &&
        rule.destination.pageId !== removedPage.id &&
        rule.destination.sectionId !== sectionId
    );

    if (validRules.length) {
      page.routing.rules = validRules;
    } else {
      page.routing = null;
    }
  });
};

module.exports = onPageDeleted;
