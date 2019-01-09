const Resolvers = {};

Resolvers.ExpressionGroup2 = {
  expressions: ({ id }, args, ctx) =>
    ctx.repositories.BinaryExpression2.getByExpressionGroupId(id)
};

Resolvers.Mutation = {
  updateExpressionGroup2: async (root, { input: { id, operator } }, ctx) =>
    ctx.repositories.ExpressionGroup2.update({
      id,
      operator
    })
};

module.exports = Resolvers;
