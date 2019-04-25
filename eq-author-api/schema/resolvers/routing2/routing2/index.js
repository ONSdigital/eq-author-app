const { flatMap, find, first } = require("lodash/fp");

const { saveQuestionnaire } = require("../../../../utils/datastore");
const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");
const {
  createRouting,
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../src/businessLogic");

const answerTypeToConditions = require("../../../../src/businessLogic/answerTypeToConditions");
const {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  NULL,
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
        return page;
      }
    }, pages);
  },
  rules: routing => routing.rules,
};

Resolvers.Mutation = {
  createRouting2: async (root, { input }, ctx) => {
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

    const leftHandSide = hasRoutableFirstAnswer
      ? {
          answerId: firstAnswer.id,
          type: "Answer",
        }
      : {
          type: NULL,
          nullReason: NO_ROUTABLE_ANSWER_ON_PAGE,
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
              }),
            ],
          }),
          destination: createDestination({ logical: "NextPage" }),
        }),
      ],
    });
    await saveQuestionnaire(ctx.questionnaire);
    return page.routing;
  },
  updateRouting2: async (root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }

    const allRouting = flatMap(page => page.routing, getPages(ctx));

    const routing = find({ id: input.id }, allRouting);

    routing.else = {
      id: routing.else.id,
      ...input.else,
    };
    await saveQuestionnaire(ctx.questionnaire);
    return routing;
  },
};

module.exports = Resolvers;
