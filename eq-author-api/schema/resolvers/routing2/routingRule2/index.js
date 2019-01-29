const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const { flatMap, find, some, reject, getOr, pick } = require("lodash/fp");
const save = require("../../../../utils/saveQuestionnaire");
const {
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../src/businessLogic");
const availableRoutingDestinations = require("../../../../src/businessLogic/availableRoutingDestinations");
const validateRoutingDestinations = require("../../../../src/businessLogic/validateRoutingDestination");

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
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    const allRouting = flatMap(page => page.routing, pages);
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
    const routing = find(
      { id: input.routingId },
      flatMap(
        page => page.routing,
        flatMap(section => section.pages, ctx.questionnaire.sections)
      )
    );

    const routingRule = createRoutingRule({
      expressionGroup: createExpressionGroup({
        expressions: [
          createExpression({
            left: createLeftSide({
              type: "Null",
              nullReason: "NoRoutableAnswerOnPage",
            }),
          }),
        ],
      }),
      destination: createDestination({ logical: "NextPage" }),
    });

    routing.rules.push(routingRule);

    save(ctx.questionnaire);
    return routingRule;
  },
  updateRoutingRule2: (root, { input: { id, destination } }, ctx) => {
    if (!isMutuallyExclusiveDestination(destination)) {
      throw new Error("Can only provide one destination.");
    }

    const allPages = flatMap(
      section => section.pages,
      ctx.questionnaire.sections
    );

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

    save(ctx.questionnaire);

    return routingRule;
  },
  deleteRoutingRule2: (root, { input }, ctx) => {
    const routing = find(routing => {
      if (some({ id: input.id }, routing.rules)) {
        return routing;
      }
    }, flatMap(page => page.routing, flatMap(section => section.pages, ctx.questionnaire.sections)));

    routing.rules = reject({ id: input.id }, routing.rules);

    save(ctx.questionnaire);
    return routing;
  },
};

module.exports = Resolvers;
