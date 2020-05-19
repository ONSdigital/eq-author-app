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
const {
  // NO_ROUTABLE_ANSWER_ON_PAGE,
  NULL,
  DEFAULT_ROUTING,
} = require("../../../../constants/routingNoLeftSide");

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
        console.log("\n\nRouting2 = = = =  ", pages.routing);

        return page;
      }
    }, pages);
  },

  rules: routing => {
    console.log(
      "\n\nrouting.rules in routing2",
      routing.rules[0].expressionGroup.expressions[0]
    );
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

    console.log("\n\nfirstAnswer", firstAnswer);

    const hasRoutableFirstAnswer =
      firstAnswer &&
      answerTypeToConditions.isAnswerTypeSupported(firstAnswer.type);

    let condition;
    if (hasRoutableFirstAnswer) {
      condition = answerTypeToConditions.getDefault(firstAnswer.type);
      // condition = null;
    } else {
      condition = "Equal";
    }

    // const leftHandSide = hasRoutableFirstAnswer
    //   ? {
    //       answerId: firstAnswer.id,
    //       type: "Answer",
    //     }
    //   : {
    //       type: NULL,
    //       nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
    //     };

    const leftHandSide = {
      type: NULL,
      nullReason: DEFAULT_ROUTING,
    };

    page.routing = createRouting({
      else: createDestination({ logical: "NextPage" }),
      rules: [
        createRoutingRule({
          expressionGroup: createExpressionGroup({
            expressions: [
              createExpression({
                left: createLeftSide(leftHandSide),
                // left: {
                //   displayName: "Select an answer",
                //   sideType: "Default",
                //   reason: "defaultReason",
                // },
                condition,
                right: createRightSide(firstAnswer),
              }),
            ],
          }),
          destination: createDestination({ logical: "NextPage" }),
        }),
      ],
    });

    console.log(
      "\n\nleft = = = = = = ",
      page.routing.rules[0].expressionGroup.expressions[0].left
    );
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
