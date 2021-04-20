const { find } = require("lodash/fp");

const { createMutation } = require("../../../createMutation");

const {
  createRouting,
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
  updateDestination,
} = require("../../../../../src/businessLogic");

const { getPages, getPageById, getRoutingById } = require("../../../utils");

const Resolvers = {};

Resolvers.Routing2 = {
  else: (routing) => routing.else,
  page: ({ id }, args, ctx) => {
    const pages = getPages(ctx);
    return find((page) => {
      if (page.routing && page.routing.id === id) {
        return page;
      }
    }, pages);
  },

  rules: (routing) => {
    return routing.rules;
  },
};

Resolvers.Mutation = {
  createRouting2: createMutation((root, { input }, ctx) => {
    const page = getPageById(ctx, input.pageId);

    if (page.routing) {
      throw new Error("Can only have one Routing per Page.");
    }

    const leftHandSide = {
      type: "Null",
      nullReason: "DefaultRouting",
    };

    page.routing = createRouting({
      else: createDestination({ logical: "NextPage" }),
      rules: [
        createRoutingRule({
          expressionGroup: createExpressionGroup({
            expressions: [
              createExpression({
                left: createLeftSide(leftHandSide),
              }),
            ],
          }),
          destination: createDestination(),
        }),
      ],
    });

    return page.routing;
  }),

  updateRouting2: createMutation((_, { input }, ctx) => {
    const routing = getRoutingById(ctx, input.id);
    routing.else = updateDestination(routing.else, input.else);
    return routing;
  }),
};

module.exports = Resolvers;
