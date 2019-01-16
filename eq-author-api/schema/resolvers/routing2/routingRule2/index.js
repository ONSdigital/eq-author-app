const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const Resolvers = {};

Resolvers.RoutingRule2 = {
  destination: ({ destinationId }, args, ctx) =>
    ctx.repositories.Destination.getById(destinationId),
  expressionGroup: ({ id }, args, ctx) =>
    ctx.repositories.ExpressionGroup2.getByRuleId(id),
  routing: ({ routingId }, args, ctx) =>
    ctx.repositories.Routing2.getById(routingId),
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
    ctx.repositories.RoutingRule2.delete(input.id),
};

module.exports = Resolvers;
