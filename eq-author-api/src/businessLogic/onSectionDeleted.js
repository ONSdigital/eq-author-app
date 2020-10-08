const onPageDeleted = require("../../src/businessLogic/onPageDeleted");
const { getPages } = require("../../schema/resolvers/utils");

const onSectionDeleted = (ctx, removedSection) => {
  removedSection.folders.forEach(folder => {
    folder.pages.forEach(page => {
      onPageDeleted(ctx, removedSection, page);
    });
  });

  const allPages = getPages(ctx);
  allPages.forEach(page => {
    if (!page.routing) {
      return;
    }
    const elseRoute = page.routing.else;
    if (elseRoute.sectionId === removedSection.id) {
      elseRoute.sectionId = null;
    }

    page.routing.rules.map(rule => {
      if (rule.destination.sectionId === removedSection.id) {
        rule.destination.sectionId = null;
      }
    });
  });
};

module.exports = onSectionDeleted;
