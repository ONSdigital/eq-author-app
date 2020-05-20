const { flatMap, find, first } = require("lodash/fp");

const { createMutation } = require("../../createMutation");

const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");
const {
  createRouting,
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
  createRightSide,
} = require("../../../../src/businessLogic");

const answerTypeToConditions = require("../../../../src/businessLogic/answerTypeToConditions");
const { getPages, getPageById } = require("../../utils");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const Resolvers = {};

Resolvers.Routing2 = {
  else: routing => routing.else,
  page: ({ id }, args, ctx) => {
    const pages = getPages(ctx);
    return find(page => {
      if (page.routing && page.routing.id === id) {
        return page;
      }
    }, pages);
  },

  rules: routing => {
    return routing.rules;
  },
};

Resolvers.Mutation = {
  createRouting2: createMutation((root, { input }, ctx) => {
    const page = getPageById(ctx, input.pageId);

    if (page.routing) {
      throw new Error("Can only have one Routing per Page.");
    }

    const firstAnswer = first(page.answers);

    const hasRoutableFirstAnswer =
      firstAnswer &&
      answerTypeToConditions.isAnswerTypeSupported(firstAnswer.type);

    let condition;
    if (hasRoutableFirstAnswer) {
      condition = answerTypeToConditions.getDefault(firstAnswer.type);
    } else {
      condition = "Equal";
    }

    const leftHandSide = {
      answerId: firstAnswer.id,
      type: "Default",
    };

    page.routing = createRouting({
      else: createDestination({ logical: "NextPage" }),
      rules: [
        createRoutingRule({
          expressionGroup: createExpressionGroup({
            expressions: [
              createExpression({
                left: createLeftSide(leftHandSide),
                condition,
                right: createRightSide(firstAnswer),
              }),
            ],
          }),
          destination: createDestination({ logical: "NextPage" }),
        }),
      ],
    });

    return page.routing;
  }),

  updateRouting2: createMutation((root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }

    const allRouting = flatMap(page => page.routing, getPages(ctx));

    const routing = find({ id: input.id }, allRouting);

    routing.else = {
      id: routing.else.id,
      ...input.else,
    };
    return routing;
  }),
};

module.exports = Resolvers;
