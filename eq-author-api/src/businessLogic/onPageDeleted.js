const { getPages } = require("../../schema/resolvers/utils");
const { NEXT_PAGE } = require("../../constants/logicalDestinations");

const onPageDeleted = (ctx, removedPageId) => {
  const allPages = getPages(ctx);

  allPages.forEach(page => {
    if (!page.routing) {
      return;
    }

    const elseRoute = page.routing.else;
    if (
      elseRoute.pageId === removedPageId ||
      elseRoute.sectionId === removedPageId
    ) {
      elseRoute.sectionId = null;
      elseRoute.pageId = null;
      elseRoute.logical = NEXT_PAGE;
    }

    const validRules = page.routing.rules.filter(
      rule =>
        rule.destination &&
        rule.destination.pageId !== removedPageId &&
        rule.destination.sectionId !== removedPageId
    );

    if (validRules.length) {
      page.routing.rules = validRules;
    } else {
      page.routing = null;
    }
  });
};

module.exports = onPageDeleted;
