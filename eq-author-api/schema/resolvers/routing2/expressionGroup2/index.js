const Resolvers = {};

const { find, flatMap, getOr } = require("lodash/fp");
const { saveQuestionnaire } = require("../../../../utils/datastore");

Resolvers.ExpressionGroup2 = {
  expressions: expressionGroup => expressionGroup.expressions,
};

Resolvers.Mutation = {
  updateExpressionGroup2: async (root, { input: { id, operator } }, ctx) => {
    const expressionGroup = find(
      { id },
      flatMap(
        rule => rule.expressionGroup,
        flatMap(
          routing => routing.rules,
          flatMap(
            page => getOr([], "routing", page),
            flatMap(section => section.pages, ctx.questionnaire.sections)
          )
        )
      )
    );
    expressionGroup.operator = operator;

    await saveQuestionnaire(ctx.questionnaire);

    return expressionGroup;
  },
};

module.exports = Resolvers;
