const Resolvers = {};

const { find, flatMap, get } = require("lodash/fp");
const { createMutation } = require("../../../createMutation");

const { getPages } = require("../../../utils");

Resolvers.ExpressionGroup2 = {
  expressions: expressionGroup => expressionGroup.expressions,
  validationErrorInfo: ({ id }, args, ctx) => {
    const keys = Object.keys(ctx.validationErrorInfo.expressions);
    const errors = keys.map(key => {
      return ctx.validationErrorInfo.expressions[key].errors[0];
    });
    return (
      errors || {
        id,
        errors: [],
        totalCount: 0,
      }
    );
  },
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
