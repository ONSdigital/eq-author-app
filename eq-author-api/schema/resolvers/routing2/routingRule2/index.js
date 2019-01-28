const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const { flatMap, find, some, first, remove, reject } = require("lodash/fp");
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

    /**
     *
     * const validateDestination = async (rule, destinationField, destination) => {
    const routing = await repositories.Routing2.getById(rule.routingId);
    const availableDestinations = await repositories.Page.getRoutingDestinations(
      routing.pageId
    );
    let list;
    if (destinationField === "pageId") {
      list = availableDestinations.questionPages;
    } else if (destinationField === "sectionId") {
      list = availableDestinations.sections;
    }
    const id = parseInt(destination[destinationField], 10);

    const result = find({ id })(list);
    if (isNil(result)) {
      throw new Error(`The provided desination is invalid`);
    }
  };

     return async ({ id, destination }) => {
    const routingRule = await repositories.RoutingRule2.getById(id);
    const destinationField = Object.keys(destination)[0];
    if (destinationField !== "logical") {
      await validateDestination(routingRule, destinationField, destination);
    }

    await repositories.Destination.update({
      id: routingRule.destinationId,
      ...destination,
    });
    return routingRule;
  };
     */
    return ctx.modifiers.RoutingRule.update({ id, destination });
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
