const {
  flatMap,
  find,
  some,
  reject,
  getOr,
  pick,
  first,
} = require("lodash/fp");

const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const conditions = require("../../../../constants/routingConditions");

const { saveQuestionnaire } = require("../../../../utils/datastore");
const {
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../src/businessLogic");
const availableRoutingDestinations = require("../../../../src/businessLogic/availableRoutingDestinations");
const validateRoutingDestinations = require("../../../../src/businessLogic/validateRoutingDestination");
const answerTypeToConditions = require("../../../../src/businessLogic/answerTypeToConditions");
const {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  NULL,
} = require("../../../../constants/routingNoLeftSide");

const { getPages } = require("../../utils");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const Resolvers = {};

Resolvers.RoutingRule2 = {
  destination: routingRule => routingRule.destination,
  expressionGroup: routingRule => routingRule.expressionGroup,
  routing: ({ id }, args, ctx) => {
    const pages = getPages(ctx);
    const allRouting = flatMap(page => page.routing, pages).filter(Boolean);
    const routing = find(routing => {
      if (some({ id }, routing.rules)) {
        return routing;
      }
    }, allRouting);
    return routing;
  },
};

Resolvers.Mutation = {
  createRoutingRule2: async (root, { input }, ctx) => {
    const pages = getPages(ctx);

    const page = find(page => {
      if (page.routing && page.routing.id === input.routingId) {
        return page;
      }
    }, pages);

    const firstAnswer = first(page.answers);

    const hasRoutableFirstAnswer =
      firstAnswer &&
      answerTypeToConditions.isAnswerTypeSupported(firstAnswer.type);

    let condition = conditions.EQUAL;
    let leftHandSide = {
      type: NULL,
      nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
    };

    if (hasRoutableFirstAnswer) {
      condition = answerTypeToConditions.getDefault(firstAnswer.type);
      leftHandSide = {
        answerId: firstAnswer.id,
        type: "Answer",
      };
    }

    const routingRule = createRoutingRule({
      expressionGroup: createExpressionGroup({
        expressions: [
          createExpression({
            left: createLeftSide(leftHandSide),
            condition,
          }),
        ],
      }),
      destination: createDestination({ logical: "NextPage" }),
    });

    page.routing.rules.push(routingRule);

    await saveQuestionnaire(ctx.questionnaire);
    return routingRule;
  },
  updateRoutingRule2: async (root, { input: { id, destination } }, ctx) => {
    if (!isMutuallyExclusiveDestination(destination)) {
      throw new Error("Can only provide one destination.");
    }

    const allPages = getPages(ctx);

    const routingRule = find(
      { id },
      flatMap(
        routing => getOr([], "rules", routing),
        flatMap(page => page.routing, allPages)
      )
    );

    const page = find(page => {
      if (page.routing && some({ id }, page.routing.rules)) {
        return page;
      }
    }, allPages);

    const availableDestinations = availableRoutingDestinations(
      ctx.questionnaire,
      page.id
    );
    const destinationField = Object.keys(destination)[0];
    if (destinationField !== "logical") {
      validateRoutingDestinations({
        availableDestinations,
        destinationField,
        destination,
      });
    }

    routingRule.destination = {
      ...pick("id", routingRule.destination),
      ...destination,
    };

    await saveQuestionnaire(ctx.questionnaire);

    return routingRule;
  },
  deleteRoutingRule2: async (root, { input }, ctx) => {
    const pages = getPages(ctx);
    const page = find(page => {
      const routing = page.routing || { rules: [] };
      if (some({ id: input.id }, routing.rules)) {
        return page;
      }
    }, pages);

    const routing = page.routing;
    routing.rules = reject({ id: input.id }, routing.rules);
    if (routing.rules.length === 0) {
      page.routing = null;
    }

    await saveQuestionnaire(ctx.questionnaire);
    return page;
  },
};

module.exports = Resolvers;
