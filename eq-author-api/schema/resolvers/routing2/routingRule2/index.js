const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const { flatMap, find, some } = require("lodash/fp");
const save = require("../../../../utils/saveQuestionnaire");
const {
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../src/businessLogic");

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
  updateRoutingRule2: async (root, { input: { id, destination } }, ctx) => {
    if (!isMutuallyExclusiveDestination(destination)) {
      throw new Error("Can only provide one destination.");
    }
    return ctx.modifiers.RoutingRule.update({ id, destination });
  },
  deleteRoutingRule2: (root, { input }, ctx) =>
    ctx.modifiers.RoutingRule.delete(input.id),
};

module.exports = Resolvers;
