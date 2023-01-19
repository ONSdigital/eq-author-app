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
  getExpressionGroupById,
  getExpressionById,
  getAllExpressionGroups,
  getExpressionGroupByExpressionId,
  returnValidationErrors,
} = require("../../utils");

const Resolvers = {};

const answerTypeToConditions = require("../../../../src/businessLogic/answerTypeToConditions");

const isLeftSideAnswerTypeCompatible = (
  leftSideType,
  rightSideType,
  secondaryCondition
) => {
  const AnswerTypesToRightTypes = {
    [answerTypes.CURRENCY]: "Custom",
    [answerTypes.NUMBER]: "Custom",
    [answerTypes.PERCENTAGE]: "Custom",
    [answerTypes.UNIT]: "Custom",
    [answerTypes.RADIO]: "SelectedOptions",
    [answerTypes.CHECKBOX]: "SelectedOptions",
    [answerTypes.DATE]: "DateValue",
    [answerTypes.SELECT]: "SelectedOptions",
  };

  if (secondaryCondition) {
    return true;
  }
  return AnswerTypesToRightTypes[leftSideType] === rightSideType;
};

Resolvers.BinaryExpression2 = {
  left: async ({ left }, args, ctx) => {
    if (left.type === "Answer") {
      const answer = getAnswerById(ctx, left.answerId);
      return { ...answer, sideType: left.type };
    }

    if (left.type === "Metadata") {
      const metadata = find(
        { id: left.metadataId },
        ctx.questionnaire.metadata
      );

      return { ...metadata, sideType: left.type };
    }

    return { sideType: left.type, reason: left.nullReason };
  },
  right: async ({ right }) => {
    if (
      right &&
      ["Custom", "SelectedOptions", "DateValue"].includes(right.type)
    ) {
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
      if (
        [answerTypes.RADIO, answerTypes.CHECKBOX, answerTypes.SELECT].includes(
          type
        )
      ) {
        return "MultipleChoiceAnswer";
      }
      return "BasicAnswer";
    }
    if (sideType === "Metadata") {
      return "Metadata";
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
    if (right.type === "DateValue") {
      return "DateValue";
    }
  },
};

Resolvers.CustomValue2 = {
  number: ({ customValue: { number } }) => number,
  text: ({ customValue: { text } }) => text,
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

Resolvers.DateValue = {
  offset: ({ dateValue: { offset } }) => {
    return offset;
  },
  offsetDirection: ({ dateValue: { offsetDirection } }) => {
    return offsetDirection;
  },
};

Resolvers.Mutation = {
  createBinaryExpression2: createMutation((root, { input }, ctx) => {
    const expressionGroup = getExpressionGroupById(
      ctx,
      input.expressionGroupId
    );

    let leftHandSide = {
      type: "Null",
      nullReason: "DefaultRouting",
    };

    let expression;

    expression = createExpression({
      left: createLeftSide(leftHandSide),
      condition: null,
      secondaryCondition: null,
    });

    expressionGroup.expressions.push(expression);

    return expression;
  }),

  updateBinaryExpression2: createMutation(
    (root, { input: { id, condition, secondaryCondition } }, ctx) => {
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

      if (expression.condition === "Unanswered") {
        expression.right.optionIds = [];
      }

      if (secondaryCondition !== null || secondaryCondition !== undefined) {
        expression.secondaryCondition = secondaryCondition;
      }

      return expression;
    }
  ),

  updateLeftSide2: createMutation((root, { input }, ctx) => {
    const { expressionId, answerId, metadataId } = input;

    const expression = getExpressionById(ctx, expressionId);

    if (answerId) {
      const answer = getAnswerById(ctx, answerId);

      const updatedLeftSide = {
        ...expression.left,
        answerId,
        type: "Answer",
      };
      delete updatedLeftSide.nullReason;

      const getRightSide = {
        ...expression.right,
      };

      expression.left = updatedLeftSide;
      expression.left.metadataId = "";
      expression.right = getRightSide;
      expression.condition = answerTypeToConditions.getDefault(answer.type);

      return expression;
    }
    if (metadataId) {
      const updatedLeftSide = {
        ...expression.left,
        metadataId,
        type: "Metadata",
      };
      delete updatedLeftSide.nullReason;

      const getRightSide = {
        ...expression.right,
      };

      expression.left = updatedLeftSide;
      expression.left.answerId = "";
      expression.right = getRightSide;
      expression.condition = "Matches";

      return expression;
    }
  }),
  updateRightSide2: createMutation((root, { input }, ctx) => {
    if (input.customValue && input.selectedOptions) {
      throw new Error("Too many right side inputs");
    }
    const { expressionId, customValue, dateValue, selectedOptions } = input;
    const expression = getExpressionById(ctx, expressionId);

    let type, newRightProperties;
    if (customValue) {
      type = "Custom";
      newRightProperties = {
        type,
        customValue,
      };
    } else if (dateValue) {
      type = "DateValue";
      newRightProperties = {
        type,
        dateValue,
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

    if (
      leftSide.answerId &&
      !isLeftSideAnswerTypeCompatible(
        leftSideAnswer.type,
        type,
        expression.secondaryCondition
      )
    ) {
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

    // Prevents bug causing validation message not to be displayed when right side text is empty after text input's first click
    if (
      expression.left.type === "Metadata" &&
      updatedRightSide.type === "Custom" &&
      !updatedRightSide.customValue.text
    ) {
      updatedRightSide.customValue.text = "";
    }

    expression.right = updatedRightSide;
    return expression;
  }),
  deleteBinaryExpression2: createMutation((root, { input }, ctx) => {
    const expressionGroup = getExpressionGroupByExpressionId(ctx, input.id);
    // Delete the expression group (e.g. skip condition or display condition) with a given ID
    expressionGroup.expressions = reject(
      { id: input.id },
      expressionGroup.expressions
    );

    return expressionGroup;
  }),
};

module.exports = Resolvers;
