const onPageDeleted = require("../../src/businessLogic/onPageDeleted");
const { getPages } = require("../../schema/resolvers/utils");

const onFolderDeleted = (ctx, removedFolder) => {
  removedFolder.pages.forEach(page => {
    onPageDeleted(ctx, removedFolder, page);
  });

  const allPages = getPages(ctx);
  allPages.forEach(page => {
    if (!page.routing) {
      return;
    }

    // not sure if this is needed or not?
    // const elseRoute = page.routing.else;
    // if (elseRoute.sectionId === removedSection.id) {
    //   elseRoute.sectionId = null;
    // }

    // page.routing.rules.map(rule => {
    //   if (rule.destination.sectionId === removedSection.id) {
    //     rule.destination.sectionId = null;
    //   }
    // });
  });
};

module.exports = onFolderDeleted;
