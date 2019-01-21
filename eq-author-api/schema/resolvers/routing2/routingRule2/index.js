const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const { flatMap, find, some } = require("lodash/fp");

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
    return find(page => {
      if (page.routing && some({ id }, page.routing.rules)) {
        return page.routing;
      }
    }, pages);
  },
};

Resolvers.Mutation = {
  createRoutingRule2: async (root, { input }, ctx) =>
    ctx.modifiers.RoutingRule.create(input.routingId),
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
