const { flatMap, get, findIndex, isNil } = require("lodash");

const getAbsoluteDestination = destination => {
  if (destination.page) {
    return { block: `block${destination.page.id}` };
  }
  return { group: `group${destination.section.id}` };
};

const getNextPageDestination = (pageId, ctx) => {
  const pages = flatMap(ctx.questionnaireJson.sections, section => {
    return section.pages.map(page => {
      return { id: page.id, sectionId: section.id };
    });
  });
  const confirmationRegex = /confirmation-page-for-(\d+)/;

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
        : "confirmation-group"
    };
  } else if (currentPage.sectionId === nextPage.sectionId) {
    return { block: `block${nextPage.id}` };
  } else {
    return { group: `group${nextPage.sectionId}` };
  }
};

const getLogicalDestination = (pageId, { logical }, ctx) => {
  if (logical === "EndOfQuestionnaire") {
    return {
      group: get(ctx.questionnaireJson, "summary")
        ? "summary-group"
        : "confirmation-group"
    };
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
    return getAbsoluteDestination(destination);
  } else {
    throw new Error(`${destination} is not a valid destination object`);
  }
};

module.exports = translateRoutingDestination;
