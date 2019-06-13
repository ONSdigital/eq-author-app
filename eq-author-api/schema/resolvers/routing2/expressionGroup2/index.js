const Resolvers = {};

const { find, flatMap, getOr } = require("lodash/fp");
const { withWritePermission } = require("../../withWritePermission");

const { getPages } = require("../../utils");

Resolvers.ExpressionGroup2 = {
  expressions: expressionGroup => expressionGroup.expressions,
};

Resolvers.Mutation = {
  updateExpressionGroup2: withWritePermission(
    (root, { input: { id, operator } }, ctx) => {
      const expressionGroup = find(
        { id },
        flatMap(
          rule => rule.expressionGroup,
          flatMap(
            routing => routing.rules,
            flatMap(page => getOr([], "routing", page), getPages(ctx))
          )
        )
      );
      expressionGroup.operator = operator;

      return expressionGroup;
    }
  ),
};

module.exports = Resolvers;
