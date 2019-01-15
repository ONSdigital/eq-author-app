const Question = require("./Question");
const translateAuthorRouting = require("./builders/routing2");
const RoutingRule = require("./RoutingRule");
const RoutingDestination = require("./RoutingDestination");
const {
  getInnerHTMLWithPiping,
  unescapePiping,
} = require("../utils/HTMLUtils");
const convertPipes = require("../utils/convertPipes");
const { get, isNil, remove, isEmpty } = require("lodash");
const { flow, getOr, last, map, some } = require("lodash/fp");

const pageTypeMappings = {
  QuestionPage: "Question",
  InterstitialPage: "Interstitial",
};

const getLastPage = flow(
  getOr([], "pages"),
  last
);

const processPipedTitle = ctx =>
  flow(
    convertPipes(ctx),
    getInnerHTMLWithPiping
  );

const processPipedText = ctx =>
  flow(
    convertPipes(ctx),
    unescapePiping
  );

const isLastPageInSection = (page, ctx) =>
  flow(
    getOr([], "sections"),
    map(getLastPage),
    some({ id: page.id })
  )(ctx);

class Block {
  constructor(page, groupId, ctx) {
    this.id = `block${page.id}`;
    this.type = this.convertPageType(page.pageType);
    this.questions = this.buildQuestions(page, ctx);
    if (page.routing && isNil(page.confirmation)) {
      // eslint-disable-next-line camelcase
      this.routing_rules = translateAuthorRouting(
        page.routing,
        page.id,
        groupId,
        ctx
      );
    } else if (
      !isLastPageInSection(page, ctx) &&
      !isNil(page.routingRuleSet) &&
      isNil(page.confirmation)
    ) {
      // eslint-disable-next-line camelcase
      this.routing_rules = this.buildRoutingRules(
        page.routingRuleSet,
        page.id,
        groupId,
        ctx
      );
    }
  }

  static buildIntroBlock(
    { introductionTitle, introductionContent },
    groupId,
    ctx
  ) {
    return {
      type: "Interstitial",
      id: `group${groupId}-introduction`,
      title: processPipedTitle(ctx)(introductionTitle) || "",
      description: processPipedText(ctx)(introductionContent) || "",
    };
  }

  buildQuestions(page, ctx) {
    return [new Question(page, ctx)];
  }

  buildRoutingRules({ routingRules, else: elseDest }, pageId, groupId, ctx) {
    routingRules.forEach(rule => {
      remove(rule.conditions, condition => isNil(condition.answer));
    });

    const rules = routingRules
      .filter(rule => !isEmpty(rule.conditions))
      .map(rule => new RoutingRule(rule, pageId, groupId, ctx));

    const elseRule = {
      goto: new RoutingDestination(elseDest, pageId, ctx),
    };

    return rules.concat(elseRule);
  }

  convertPageType(type) {
    return get(pageTypeMappings, type, type);
  }
}

module.exports = Block;
module.exports.isLastPageInSection = isLastPageInSection;
