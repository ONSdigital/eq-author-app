const { flatMap, find, some, reject, pick } = require("lodash/fp");
const { createMutation } = require("../../../createMutation");

const isMutuallyExclusive = require("../../../../../utils/isMutuallyExclusive");

const {
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../../src/businessLogic");
const availableRoutingDestinations = require("../../../../../src/businessLogic/availableRoutingDestinations");
const validateRoutingDestinations = require("../../../../../src/businessLogic/validateRoutingDestination");

const { returnValidationErrors } = require("../../../utils");

const { getPages } = require("../../../utils/pages");
const {
  getRoutingById,
  getRoutingRuleById,
} = require("../../../utils/routing");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

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
      if (!isMutuallyExclusiveDestination(destination)) {
        throw new Error("Can only provide one destination.");
      }

      const routingRule = getRoutingRuleById(ctx, id);

      const page = find((page) => {
        if (page.routing && some({ id }, page.routing.rules)) {
          return page;
        }
      }, getPages(ctx));

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
};

module.exports = Resolvers;
