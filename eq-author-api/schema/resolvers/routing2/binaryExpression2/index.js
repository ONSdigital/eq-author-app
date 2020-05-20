const answerTypes = require("../../../../constants/answerTypes");
const {
  find,
  flatMap,
  some,
  intersectionBy,
  first,
  getOr,
  reject,
  map,
} = require("lodash/fp");

const {
  createExpression,
  createRightSide,
} = require("../../../../src/businessLogic");

const { createMutation } = require("../../createMutation");

const {
  getPages,
  getAnswers,
  getAnswerById,
  getOptions,
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
    } else if (left.type === "Default") {
      const answer = getAnswerById(ctx, left.answerId);
      return {
        ...answer,
        sideType: left.type,
        reason: "DefaultRouting",
        displayName: "Select an answer",
      };
    } else {
      return { sideType: left.type, reason: left.nullReason };
    }
  },
  right: async ({ right }) => {
    if (right && ["Custom", "SelectedOptions"].includes(right.type)) {
      return right;
    }

    return null;
  },
  expressionGroup: async ({ id }, args, ctx) => {
    const pages = getPages(ctx);
    return find(
      expressionGroup => {
        if (
          expressionGroup.expressions &&
          some({ id }, expressionGroup.expressions)
        ) {
          return expressionGroup;
        }
      },
      flatMap(
        rule => rule.expressionGroup,
        flatMap(
          routing => getOr([], "rules", routing),
          flatMap(page => page.routing, pages)
        )
      )
    );
  },
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
    if (sideType === "Default") {
      return "DefaultLeftSide";
    }
  },
};

Resolvers.RightSide2 = {
  __resolveType: right => {
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
      map(optionId => ({ id: optionId }), right.optionIds)
    );
  },
};

Resolvers.Mutation = {
  createBinaryExpression2: createMutation((root, { input }, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    const rules = flatMap(
      routing => getOr([], "rules", routing),
      flatMap(page => page.routing, pages)
    );

    const expressionGroup = find(
      { id: input.expressionGroupId },
      flatMap(rule => rule.expressionGroup, rules)
    );

    const page = find(page => {
      if (
        page.routing &&
        some(rule => {
          if (rule.expressionGroup.id === input.expressionGroupId) {
            return true;
          }
        }, getOr([], "routing.rules", page))
      ) {
        return page;
      }
    }, pages);

    const firstAnswer = first(getOr([], "answers", page));

    const hasRoutableFirstAnswer =
      firstAnswer &&
      answerTypeToConditions.isAnswerTypeSupported(firstAnswer.type);
    let condition;
    if (hasRoutableFirstAnswer) {
      condition = answerTypeToConditions.getDefault(firstAnswer.type);
    }

    const left = {
      answerId: firstAnswer.id,
      type: "Default",
    };

    const expression = createExpression({
      left,
      condition: condition || "Equal",
      right: createRightSide(firstAnswer),
    });

    expressionGroup.expressions.push(expression);

    return expression;
  }),
  updateBinaryExpression2: createMutation(
    (root, { input: { id, condition } }, ctx) => {
      const pages = getPages(ctx);
      const rules = flatMap(
        routing => getOr([], "rules", routing),
        flatMap(page => page.routing, pages)
      );

      const expressionGroup = find(
        expressionGroup => {
          if (some({ id }, expressionGroup.expressions)) {
            return expressionGroup;
          }
        },
        flatMap(rule => rule.expressionGroup, rules)
      );

      const expression = find({ id }, expressionGroup.expressions);

      const leftSide = expression.left;

      if (!leftSide) {
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

    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    const rules = flatMap(
      routing => getOr([], "rules", routing),
      flatMap(page => page.routing, pages)
    );

    const expressionGroup = find(
      expressionGroup => {
        if (some({ id: expressionId }, expressionGroup.expressions)) {
          return expressionGroup;
        }
      },
      flatMap(rule => rule.expressionGroup, rules)
    );

    const expression = find({ id: expressionId }, expressionGroup.expressions);

    const answer = find(
      { id: answerId },
      flatMap(page => page.answers, pages)
    );

    const updatedLeftSide = {
      ...expression.left,
      answerId,
      type: "Answer",
    };

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
    const pages = getPages(ctx);
    const rules = flatMap(
      routing => getOr([], "rules", routing),
      flatMap(page => page.routing, pages)
    );

    const expressionGroup = find(
      expressionGroup => {
        if (some({ id: input.expressionId }, expressionGroup.expressions)) {
          return expressionGroup;
        }
      },
      flatMap(rule => rule.expressionGroup, rules)
    );

    const expression = find({ id: expressionId }, expressionGroup.expressions);

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
    {
      const pages = getPages(ctx);
      const rules = flatMap(
        routing => getOr([], "rules", routing),
        flatMap(page => page.routing, pages)
      );

      const expressionGroup = find(
        expressionGroup => {
          if (some({ id: input.id }, expressionGroup.expressions)) {
            return expressionGroup;
          }
        },
        flatMap(rule => rule.expressionGroup, rules)
      );

      expressionGroup.expressions = reject(
        { id: input.id },
        expressionGroup.expressions
      );

      return expressionGroup;
    }
  }),
};

module.exports = Resolvers;
