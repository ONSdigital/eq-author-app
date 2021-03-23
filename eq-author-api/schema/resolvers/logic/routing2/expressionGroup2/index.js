const Resolvers = {};

const { find, flatMap, get } = require("lodash/fp");
const { createMutation } = require("../../../createMutation");

const { getPages } = require("../../../utils/pages");

Resolvers.ExpressionGroup2 = {
  expressions: (expressionGroup) => expressionGroup.expressions,
  validationErrorInfo: ({ id }, args, ctx) => {
    const expressionGroupErrors = ctx.validationErrorInfo.filter(
      ({ expressionGroupId, skipConditionId }) =>
        expressionGroupId === id || skipConditionId === id
    );

    if (!expressionGroupErrors) {
      const noErrors = {
        id,
        errors: [],
        totalCount: 0,
      };
      return noErrors;
    }

    const errors = {
      id,
      errors: expressionGroupErrors,
      totalCount: expressionGroupErrors.length,
    };

    return errors;
  },
};

Resolvers.Mutation = {
  updateExpressionGroup2: createMutation(
    (root, { input: { id, operator } }, ctx) => {
      const expressionGroup = find(
        { id },
        flatMap(
          (rule) => get("expressionGroup", rule),
          flatMap(
            (routing) => get("rules", routing),
            flatMap((page) => get("routing", page), getPages(ctx))
          )
        )
      );
      expressionGroup.operator = operator;

      return expressionGroup;
    }
  ),
};

module.exports = Resolvers;
