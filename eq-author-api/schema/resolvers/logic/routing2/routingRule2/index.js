const { flatMap, find, some, reject, remove, first } = require("lodash/fp");
const { createMutation } = require("../../../createMutation");

const {
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
  updateDestination,
} = require("../../../../../src/businessLogic");

const {
  getPages,
  getRoutingById,
  getRoutingRuleById,
  returnValidationErrors,
} = require("../../../utils");

const Resolvers = {};

Resolvers.RoutingRule2 = {
  destination: (routingRule) => routingRule.destination,
  expressionGroup: (routingRule) => routingRule.expressionGroup,
  routing: ({ id }, args, ctx) => {
    const pages = getPages(ctx);
    const allRouting = flatMap((page) => page.routing, pages).filter(Boolean);
    const routing = find((routing) => {
      if (some({ id }, routing.rules)) {
        return routing;
      }
    }, allRouting);

    return routing;
  },
  validationErrorInfo: ({ id }, args, ctx) =>
    returnValidationErrors(
      ctx,
      id,
      ({ routingRuleId }) => id === routingRuleId
    ),
};

Resolvers.Mutation = {
  createRoutingRule2: createMutation((root, { input }, ctx) => {
    const routing = getRoutingById(ctx, input.routingId);
    const leftHandSide = {
      type: "Null",
      nullReason: "DefaultRouting",
    };

    const routingRule = createRoutingRule({
      expressionGroup: createExpressionGroup({
        expressions: [
          createExpression({
            left: createLeftSide(leftHandSide),
          }),
        ],
      }),
      destination: createDestination({ logical: "NextPage" }),
    });

    routing.rules.push(routingRule);

    return routingRule;
  }),
  updateRoutingRule2: createMutation(
    (root, { input: { id, destination } }, ctx) => {
      const routingRule = getRoutingRuleById(ctx, id);
      routingRule.destination = updateDestination(
        routingRule.destination,
        destination
      );
      return routingRule;
    }
  ),
  deleteRoutingRule2: createMutation((root, { input }, ctx) => {
    const pages = getPages(ctx);
    const page = find((page) => {
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

    return page;
  }),
  moveRoutingRule2: createMutation((root, { input }, ctx) => {
    const pages = getPages(ctx);
    const page = find((page) => {
      const routing = page.routing || { rules: [] };
      if (some({ id: input.id }, routing.rules)) {
        return page;
      }
    }, pages);

    const routing = page.routing;
    const routingBeingMoved = first(remove(routing, { id: input.id }));
    page.routing.splice(input.position, 0, routingBeingMoved);
  }),
};

module.exports = Resolvers;
