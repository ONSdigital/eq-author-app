const { getPages } = require("../../schema/resolvers/utils");

const onPageDeleted = (ctx, removedPageId) => {
  const allPages = getPages(ctx);

  allPages.forEach(page => {
    if (!page.routing) {
      return;
    }

    const validRules = page.routing.rules.filter(
      rule => rule.destination && rule.destination.pageId !== removedPageId
    );

    if (validRules.length) {
      page.routing.rules = validRules;
    } else {
      page.routing = null;
    }
  });
};

module.exports = onPageDeleted;
