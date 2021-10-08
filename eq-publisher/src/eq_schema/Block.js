const Question = require("./Question");

const translateAuthorRouting = require("./builders/routing2");
const translateAuthorSkipconditions = require("./builders/skipConditions");
const {
  getInnerHTMLWithPiping,
  unescapePiping,
} = require("../utils/HTMLUtils");
const convertPipes = require("../utils/convertPipes");
const { get, isNil } = require("lodash");
const { flow, getOr, last, map, some } = require("lodash/fp");

const pageTypeMappings = {
  QuestionPage: "Question",
  InterstitialPage: "Interstitial",
};

const getLastPage = flow(getOr([], "pages"), last);

const processPipedTitle = (ctx) =>
  flow(convertPipes(ctx), getInnerHTMLWithPiping);

const processPipedText = (ctx) => flow(convertPipes(ctx), unescapePiping);

const isLastPageInSection = (page, ctx) =>
  flow(getOr([], "sections"), map(getLastPage), some({ id: page.id }))(ctx);

class Block {
  constructor(page, groupId, ctx) {
    this.id = `block${page.id}`;
    this.type = this.convertPageType(page.pageType);
    this.buildPages(page, ctx);
    if (page.routing && isNil(page.confirmation)) {
      this.routing_rules = translateAuthorRouting(
        page.routing,
        page.id,
        groupId,
        ctx
      );
    }
    if (page.isConfirmationPage) {
      if (page.pageSkipConditions) {
        this.skip_conditions = this.skip_conditions || [];
        this.skip_conditions.push(
          translateAuthorSkipconditions(page.pageSkipConditions, ctx)[0]
        );
      }
      if (page.skipConditions) {
        this.skip_conditions = this.skip_conditions || [];
        this.skip_conditions.push(
          translateAuthorSkipconditions(page.skipConditions, ctx)[0]
        );
      }
    } else {
      if (page.skipConditions) {
        this.skip_conditions = this.skip_conditions || [];
        this.skip_conditions.push(
          translateAuthorSkipconditions(page.skipConditions, ctx)[0]
        );
      }
    }
  }

  static buildIntroBlock(introductionTitle, introductionContent, groupId, ctx) {
    return {
      type: "Interstitial",
      id: `group${groupId}-introduction`,
      title: processPipedTitle(ctx)(introductionTitle) || "",
      description: processPipedText(ctx)(introductionContent) || "",
    };
  }

  buildPages(page, ctx) {
    if (
      page.pageType === "QuestionPage" ||
      page.pageType === "ConfirmationQuestion"
    ) {
      this.questions = [new Question(page, ctx)];
    }
    if (page.pageType === "CalculatedSummaryPage") {
      this.titles = [
        {
          value: processPipedTitle(ctx)(page.title),
        },
      ];
      this.type = "CalculatedSummary";
      this.calculation = {
        calculation_type: "sum",
        answers_to_calculate: page.summaryAnswers.map((o) => `answer${o.id}`),
        titles: [
          {
            value: processPipedTitle(ctx)(page.totalTitle),
          },
        ],
      };
    }
  }

  convertPageType(type) {
    return get(pageTypeMappings, type, type);
  }
}

module.exports = Block;
module.exports.isLastPageInSection = isLastPageInSection;
