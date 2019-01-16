const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const Resolvers = {};

Resolvers.Routing2 = {
  else: ({ destinationId }, args, ctx) =>
    ctx.repositories.Destination.getById(destinationId),
  page: ({ pageId }, args, ctx) =>
    ctx.repositories.QuestionPage.getById(pageId),
  rules: ({ id }, args, ctx) =>
    ctx.repositories.RoutingRule2.getByRoutingId(id),
};

Resolvers.Mutation = {
  createRouting2: async (root, { input }, ctx) =>
    ctx.modifiers.Routing.create(input.pageId),
  updateRouting2: async (root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }
    return ctx.modifiers.Routing.update({
      id: input.id,
      else: input.else,
    });
  },
};

module.exports = Resolvers;
