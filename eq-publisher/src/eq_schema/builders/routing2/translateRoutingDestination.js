const { flatMap, get, findIndex, isNil } = require("lodash");

const getAbsoluteDestination = (destination) => {
  if (destination.page) {
    return { block: `block${destination.page.id}` };
  }
  return { group: `group${destination.section.id}` };
};

const getNextGroupSection = (pageId, ctx) => {
  const pages = flatMap(ctx.questionnaireJson.sections, (section) =>
    flatMap(section.folders, (folder) =>
      flatMap(folder.pages, (page) => ({
        id: page.id,
        sectionId: section.id,
        folderId: folder.id,
      }))
    )
  );

  const currentPageIndex = findIndex(pages, { id: pageId });
  const currentPage = pages[currentPageIndex];

  const afterCurrentPage = pages.slice(currentPageIndex);

  const nextSection = afterCurrentPage.find(
    (page) => currentPage.sectionId !== page.sectionId
  );

  if (isNil(nextSection)) {
    return {
      group: get(ctx, "questionnaireJson.summary")
        ? "summary-group"
        : "confirmation-group",
    };
  } else {
    return { group: `group${nextSection.sectionId}` };
  }
};

const getNextPageDestination = (pageId, ctx) => {
  const pages = flatMap(ctx.questionnaireJson.sections, (section) =>
    flatMap(section.folders, (folder) =>
      flatMap(folder.pages, (page) => ({
        id: page.id,
        sectionId: section.id,
        folderId: folder.id,
      }))
    )
  );
  const confirmationRegex = /confirmation-page-for-(.+)/;

  if (confirmationRegex.test(pageId)) {
    pageId = pageId.match(confirmationRegex)[1];
  }
  const currentPageIndex = findIndex(pages, { id: pageId });
  const currentPage = pages[currentPageIndex];
  const nextPage = pages[currentPageIndex + 1];

  if (isNil(nextPage)) {
    return {
      group: get(ctx, "questionnaireJson.summary")
        ? "summary-group"
        : "confirmation-group",
    };
  } else if (currentPage.sectionId !== nextPage.sectionId) {
    return { group: `group${nextPage.sectionId}` };
  } else {
    return { block: `block${nextPage.id}` };
  }
};

const getLogicalDestination = (pageId, { logical }, ctx) => {
  if (logical === "EndOfQuestionnaire") {
    return {
      group: get(ctx.questionnaireJson, "summary")
        ? "summary-group"
        : "confirmation-group",
    };
  } else if (logical === "EndOfCurrentSection") {
    return getNextGroupSection(pageId, ctx);
  } else if (logical === "NextPage") {
    return getNextPageDestination(pageId, ctx);
  } else {
    throw new Error(`${logical} is not a valid destination type`);
  }
};

const translateRoutingDestination = (destination, pageId, ctx) => {
  if (destination.logical) {
    return getLogicalDestination(pageId, destination, ctx);
  } else if (destination.page || destination.section) {
    return getAbsoluteDestination(destination, ctx);
  } else {
    throw new Error(`${destination} is not a valid destination object`);
  }
};

module.exports = translateRoutingDestination;
