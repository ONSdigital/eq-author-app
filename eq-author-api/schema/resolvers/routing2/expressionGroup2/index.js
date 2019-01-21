const Resolvers = {};

Resolvers.ExpressionGroup2 = {
  expressions: expressionGroup => expressionGroup.expressions,
};

Resolvers.Mutation = {
  updateExpressionGroup2: async (root, { input: { id, operator } }, ctx) =>
    ctx.repositories.ExpressionGroup2.update({
      id,
      operator,
    }),
};

module.exports = Resolvers;
