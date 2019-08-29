const Resolvers = {};

const { find, flatMap, get } = require("lodash/fp");
const { createMutation } = require("../../createMutation");

const { getPages } = require("../../utils");

Resolvers.ExpressionGroup2 = {
  expressions: expressionGroup => expressionGroup.expressions,
};

Resolvers.Mutation = {
  updateExpressionGroup2: createMutation(
    (root, { input: { id, operator } }, ctx) => {
      const expressionGroup = find(
        { id },
        flatMap(
          rule => get("expressionGroup", rule),
          flatMap(
            routing => get("rules", routing),
            flatMap(page => get("routing", page), getPages(ctx))
          )
        )
      );
      expressionGroup.operator = operator;

      return expressionGroup;
    }
  ),
};

module.exports = Resolvers;
