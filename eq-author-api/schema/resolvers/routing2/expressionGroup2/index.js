const Resolvers = {};

const { find, flatMap, getOr } = require("lodash/fp");
const { saveQuestionnaire } = require("../../../../utils/datastore");

Resolvers.ExpressionGroup2 = {
  expressions: expressionGroup => expressionGroup.expressions,
};

Resolvers.Mutation = {
  updateExpressionGroup2: (root, { input: { id, operator } }, ctx) => {
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
    return saveQuestionnaire(ctx.questionnaire);
  },
};

module.exports = Resolvers;
