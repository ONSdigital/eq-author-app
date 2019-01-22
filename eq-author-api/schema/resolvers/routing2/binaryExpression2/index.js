const answerTypes = require("../../../../constants/answerTypes");
const { find, flatMap, some, intersectionBy } = require("lodash/fp");

const Resolvers = {};

Resolvers.BinaryExpression2 = {
  left: async ({ left }, args, ctx) => {
    if (left.type === "Answer") {
      const answer = find(
        { id: left.answerId },
        flatMap(
          page => page.answers,
          flatMap(section => section.pages, ctx.questionnaire.sections)
        )
      );

      return { ...answer, sideType: left.type };
    }

    return { sideType: left.type, reason: left.nullReason };
  },
  right: async ({ right }, args, ctx) => {
    if (right && ["Custom", "SelectedOptions"].includes(right.type)) {
      return right;
    }

    return null;
  },
  expressionGroup: async ({ id }, args, ctx) => {
    const pages = flatMap(section => section.pages, ctx.questionnaire.sections);
    return find(expressionGroup => {
      if (
        expressionGroup.expressions &&
        some({ id }, expressionGroup.expressions)
      ) {
        return expressionGroup;
      }
    }, flatMap(rule => rule.expressionGroup, flatMap(routing => routing.rules, flatMap(page => page.routing, pages))));
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
    const options = flatMap(
      answer => answer.options,
      flatMap(
        page => page.answers,
        flatMap(section => section.pages, ctx.questionnaire.sections)
      )
    );

    return intersectionBy("id", options, right.selectedOptions);
  },
};

Resolvers.Mutation = {
  createBinaryExpression2: async (root, { input }, ctx) => {
    const expressionGroupId = parseInt(input.expressionGroupId, 10);
    return ctx.modifiers.BinaryExpression.create(expressionGroupId);
  },
  updateBinaryExpression2: async (root, { input: { id, condition } }, ctx) =>
    ctx.modifiers.BinaryExpression.update({ id, condition }),

  updateLeftSide2: (root, { input }, ctx) =>
    ctx.modifiers.LeftSide.update(input),
  updateRightSide2: (root, { input }, ctx) => {
    if (input.customValue && input.selectedOptions) {
      throw new Error("Too many right side inputs");
    }
    return ctx.modifiers.RightSide.update(input);
  },
  deleteBinaryExpression2: (root, { input }, ctx) =>
    ctx.repositories.BinaryExpression2.delete(input.id),
};

module.exports = Resolvers;
