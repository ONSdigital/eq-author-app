const Resolvers = {};

const { find, flatMap } = require("lodash/fp");
const save = require("../../../../utils/saveQuestionnaire");

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
            page => page.routing,
            flatMap(section => section.pages, ctx.questionnaire.sections)
          )
        )
      )
    );
    expressionGroup.operator = operator;
    save(ctx.questionnaire);
  },
};

module.exports = Resolvers;
