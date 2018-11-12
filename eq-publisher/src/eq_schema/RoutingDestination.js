const { flatMap, get, findIndex, isNil } = require("lodash");

class RoutingDestination {
  constructor(goto, pageId, ctx) {
    if (goto.__typename === "LogicalDestination") {
      this.getLogicalDestination(pageId, goto.logicalDestination, ctx);
    } else if (goto.__typename === "AbsoluteDestination") {
      this.getAbsoluteDestination(goto.absoluteDestination);
    } else {
      throw new Error(`${goto} is not a valid destination object`);
    }
  }

  getAbsoluteDestination(destination) {
    if (destination.__typename === "QuestionPage") {
      this.block = `block${destination.id}`;
    } else if (destination.__typename === "Section") {
      this.group = `group${destination.id}`;
    } else {
      throw new Error(
        `${destination.__typename} is not a valid destination type`
      );
    }
  }

  getLogicalDestination(pageId, logicalDestination, ctx) {
    if (logicalDestination === "EndOfQuestionnaire") {
      this.group = get(ctx.questionnaireJson, "summary")
        ? "summary-group"
        : "confirmation-group";
    } else if (logicalDestination === "NextPage") {
      this.getNextPageDestination(pageId, ctx);
    } else {
      throw new Error(`${logicalDestination} is not a valid destination type`);
    }
  }

  getNextPageDestination(pageId, ctx) {
    const pages = flatMap(ctx.questionnaireJson.sections, section => {
      return section.pages.map(page => {
        return { id: page.id, sectionId: section.id };
      });
    });

    const currentPageIndex = findIndex(pages, { id: pageId });
    const currentPage = pages[currentPageIndex];
    const nextPage = pages[currentPageIndex + 1];

    if (isNil(nextPage)) {
      this.group = get(ctx, "questionnaireJson.summary")
        ? "summary-group"
        : "confirmation-group";
    } else if (currentPage.sectionId === nextPage.sectionId) {
      this.block = `block${nextPage.id}`;
    } else {
      this.group = `group${nextPage.sectionId}`;
    }
  }
}

module.exports = RoutingDestination;
