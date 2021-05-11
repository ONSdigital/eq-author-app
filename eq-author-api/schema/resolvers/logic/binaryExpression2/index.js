const answerTypes = require("../../../../constants/answerTypes");
const { find, some, intersectionBy, reject, map } = require("lodash/fp");

const {
  createExpression,
  createLeftSide,
} = require("../../../../src/businessLogic");

const { createMutation } = require("../../createMutation");

const {
  getAnswers,
  getAnswerById,
  getOptions,
  getExpressionGroups,
  getExpressionGroupById,
  getExpressionById,
  getSkipConditionById,
  getSkipConditions,
  getAllExpressionGroups,
  returnValidationErrors,
} = require("../../utils");

const Resolvers = {};

const answerTypeToConditions = require("../../../../src/businessLogic/answerTypeToConditions");

const isLeftSideAnswerTypeCompatible = (leftSideType, rightSideType) => {
  const AnswerTypesToRightTypes = {
    [answerTypes.CURRENCY]: "Custom",
    [answerTypes.NUMBER]: "Custom",
    [answerTypes.PERCENTAGE]: "Custom",
    [answerTypes.UNIT]: "Custom",
    [answerTypes.RADIO]: "SelectedOptions",
    [answerTypes.CHECKBOX]: "SelectedOptions",
  };

  return AnswerTypesToRightTypes[leftSideType] === rightSideType;
};

Resolvers.BinaryExpression2 = {
  left: async ({ left }, args, ctx) => {
    if (left.type === "Answer") {
      const answer = getAnswerById(ctx, left.answerId);
      return { ...answer, sideType: left.type };
    }

    return { sideType: left.type, reason: left.nullReason };
  },
  right: async ({ right }) => {
    if (right && ["Custom", "SelectedOptions"].includes(right.type)) {
      return right;
    }

    return null;
  },
  expressionGroup: async ({ id }, args, ctx) => {
    return find((expressionGroup) => {
      if (
        expressionGroup.expressions &&
        some({ id }, expressionGroup.expressions)
      ) {
        return expressionGroup;
      }
    }, getAllExpressionGroups(ctx));
  },
  validationErrorInfo: ({ id }, args, ctx) =>
    returnValidationErrors(ctx, id, ({ expressionId }) => id === expressionId),
};

Resolvers.LeftSide2 = {
  __resolveType: ({ type, sideType }) => {
    if (sideType === "Answer") {
      if ([answerTypes.RADIO, answerTypes.CHECKBOX].includes(type)) {
        return "MultipleChoiceAnswer";
      }
      return "BasicAnswer";
    }
    if (sideType === "Null") {
      return "NoLeftSide";
    }
  },
};

Resolvers.RightSide2 = {
  __resolveType: (right) => {
    if (right.type === "Custom") {
      return "CustomValue2";
    }
    if (right.type === "SelectedOptions") {
      return "SelectedOptions2";
    }
  },
};

Resolvers.CustomValue2 = {
  number: ({ customValue: { number } }) => number,
};

Resolvers.SelectedOptions2 = {
  options: async (right, args, ctx) => {
    return intersectionBy(
      "id",
      getOptions(ctx),
      map((optionId) => ({ id: optionId }), right.optionIds)
    );
  },
};

Resolvers.Mutation = {
  createBinaryExpression2: createMutation((root, { input }, ctx) => {
    const expressionGroup = getExpressionGroupById(
      ctx,
      input.expressionGroupId
    );

    const skipCondition = getSkipConditionById(ctx, input.expressionGroupId);

    let leftHandSide = {
      type: "Null",
    };

    let expression;

    if (expressionGroup) {
      leftHandSide.nullReason = "DefaultRouting";

      expression = createExpression({
        left: createLeftSide(leftHandSide),
      });

      expressionGroup.expressions.push(expression);
    }

    if (skipCondition) {
      leftHandSide.nullReason = "DefaultSkipCondition";

      expression = createExpression({
        left: createLeftSide(leftHandSide),
        condition: null,
      });

      skipCondition.expressions.push(expression);
    }

    return expression;
  }),

  updateBinaryExpression2: createMutation(
    (root, { input: { id, condition } }, ctx) => {
      const expression = getExpressionById(ctx, id);

      const leftSide = expression.left;

      if (!leftSide || leftSide.type === "Null") {
        throw new Error("Can't have a condition without a left side");
      }

      const answers = getAnswers(ctx);

      const leftSideAnswer = find({ id: leftSide.answerId }, answers);
      if (!answerTypeToConditions.isValid(leftSideAnswer.type, condition)) {
        throw new Error(
          "This condition is not compatible with the existing left side"
        );
      }

      expression.condition = condition;

      return expression;
    }
  ),

  updateLeftSide2: createMutation((root, { input }, ctx) => {
    const { expressionId, answerId } = input;

    const expression = getExpressionById(ctx, expressionId);

    const answer = getAnswerById(ctx, answerId);

    const updatedLeftSide = {
      ...expression.left,
      answerId,
      type: "Answer",
    };
    delete updatedLeftSide.nullReason;

    expression.left = updatedLeftSide;
    expression.right = null;
    expression.condition = answerTypeToConditions.getDefault(answer.type);

    return expression;
  }),
  updateRightSide2: createMutation((root, { input }, ctx) => {
    if (input.customValue && input.selectedOptions) {
      throw new Error("Too many right side inputs");
    }

    const { expressionId, customValue, selectedOptions } = input;

    const expression = getExpressionById(ctx, expressionId);

    let type, newRightProperties;
    if (customValue) {
      type = "Custom";
      newRightProperties = {
        type,
        customValue,
      };
    } else {
      type = "SelectedOptions";
      newRightProperties = {
        type,
      };
    }

    const leftSide = expression.left;
    if (!leftSide) {
      throw new Error("Cannot have a right side without a left");
    }

    const leftSideAnswer = getAnswerById(ctx, leftSide.answerId);

    if (!isLeftSideAnswerTypeCompatible(leftSideAnswer.type, type)) {
      throw new Error("Left side is incompatible with Right side.");
    }

    let existingRightSide = expression.right;

    let updatedRightSide;
    if (existingRightSide) {
      updatedRightSide = {
        ...existingRightSide,
        ...newRightProperties,
      };
    } else {
      updatedRightSide = {
        ...newRightProperties,
      };
    }
    if (updatedRightSide.type === "SelectedOptions") {
      updatedRightSide.optionIds = selectedOptions;
    }

    expression.right = updatedRightSide;

    return expression;
  }),
  deleteBinaryExpression2: createMutation((root, { input }, ctx) => {
    const routingExpressionGroups = getExpressionGroups(ctx);
    const skipConditions = getSkipConditions(ctx);
    const expressionGroup = find(
      (expressionGroup) => {
        if (some({ id: input.id }, expressionGroup.expressions)) {
          return expressionGroup;
        }
      },
      [...routingExpressionGroups, ...skipConditions]
    );

    expressionGroup.expressions = reject(
      { id: input.id },
      expressionGroup.expressions
    );

    return expressionGroup;
  }),
};

module.exports = Resolvers;
