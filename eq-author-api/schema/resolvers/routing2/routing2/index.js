const isMutuallyExclusive = require("../../../../utils/isMutuallyExclusive");

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

const { flatMap, find, first } = require("lodash/fp");
const save = require("../../../../utils/saveQuestionnaire");
const {
  createRouting,
  createDestination,
  createRoutingRule,
  createExpressionGroup,
  createExpression,
  createLeftSide,
} = require("../../../../src/businessLogic");

const answerTypeToConditions = require("../../../../modifiers/BinaryExpression/answerTypeToConditions");
const {
  NO_ROUTABLE_ANSWER_ON_PAGE,
  NULL,
} = require("../../../../constants/routingNoLeftSide");
const Resolvers = {};

Resolvers.Routing2 = {
  else: routing => routing.else,
  page: ({ id }, args, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
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
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    const page = find({ id: input.pageId }, pages);

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
    save(ctx.questionnaire);
    return page.routing;
  },
  updateRouting2: async (root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }

    const allRouting = flatMap(
      page => page.routing,
      flatMap(section => section.pages, ctx.questionnaire.sections)
    );

    const routing = find({ id: input.id }, allRouting);

    routing.else = input.else;
    save(ctx.questionnaire);
    return routing;
  },
};

module.exports = Resolvers;
