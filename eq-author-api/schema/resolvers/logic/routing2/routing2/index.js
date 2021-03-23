const { find } = require("lodash/fp");

const { createMutation } = require("../../../createMutation");

const isMutuallyExclusive = require("../../../../../utils/isMutuallyExclusive");
const {
  createRouting,
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../../src/businessLogic");

const { getRoutingById } = require("../../../utils/routing");
const { getPages, getPageById } = require("../../../utils/pages");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

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
          destination: createDestination({ logical: "Default" }),
        }),
      ],
    });

    return page.routing;
  }),

  updateRouting2: createMutation((root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }

    const routing = getRoutingById(ctx, input.id);

    routing.else = {
      id: routing.else.id,
      ...input.else,
    };

    return routing;
  }),
};

module.exports = Resolvers;
