const onFolderDeleted = require("../../src/businessLogic/onFolderDeleted");
const { getPages } = require("../../schema/resolvers/utils");

const onSectionDeleted = (ctx, removedSection) => {
  removedSection.folders.forEach(folder => {
    onFolderDeleted(ctx, folder);
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
