const answerTypes = require("../../../constants/answerTypes");

const Resolvers = {};

const isMutuallyExclusive = mutuallyExclusiveFields => object => {
  const applicableFields = Object.keys(object).filter(key =>
    mutuallyExclusiveFields.includes(key)
  );
  return applicableFields.length === 1;
};

const isMutuallyExclusiveDestination = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical"
]);

Resolvers.Mutation = {
  createRouting2: async (root, { input }, ctx) =>
    ctx.modifiers.Routing.create(input.pageId),
  updateRouting2: async (root, { input }, ctx) => {
    if (!isMutuallyExclusiveDestination(input.else)) {
      throw new Error("Can only provide one destination.");
    }
    return ctx.modifiers.Routing.update({
      id: input.id,
      else: input.else
    });
  },
  createRoutingRule2: async (root, { input }, ctx) =>
    ctx.modifiers.RoutingRule.create(input.routingId),
  updateRoutingRule2: async (root, { input: { id, destination } }, ctx) => {
    if (!isMutuallyExclusiveDestination(destination)) {
      throw new Error("Can only provide one destination.");
    }
    return ctx.modifiers.RoutingRule.update({ id, destination });
  },
  updateExpressionGroup2: async (root, { input: { id, operator } }, ctx) =>
    ctx.repositories.ExpressionGroup2.update({
      id,
      operator
    }),
  createBinaryExpression2: async (root, { input }, ctx) => {
    const expressionGroupId = parseInt(input.expressionGroupId, 10);
    return ctx.modifiers.BinaryExpression.create(expressionGroupId);
  },
  updateBinaryExpression2: async (
    root,
    { input: { id, left, condition, right } },
    ctx
  ) => {
    if (left && !isMutuallyExclusive(["answerId", "metadataId"])(left)) {
      throw new Error("Left can only link to one entity");
    }
    if (
      right &&
      !isMutuallyExclusive([
        "answerId",
        "metadataId",
        "customValue",
        "selectedOptions"
      ])(right)
    ) {
      throw new Error("Right can only link to one entity");
    }

    const expression = await ctx.modifiers.BinaryExpression.update({
      id,
      left,
      condition,
      right
    });
    return expression;
  }
};

Resolvers.Routing2 = {
  else: ({ destinationId }, args, ctx) =>
    ctx.repositories.Destination.getById(destinationId),
  page: ({ pageId }, args, ctx) =>
    ctx.repositories.QuestionPage.getById(pageId),
  rules: ({ id }, args, ctx) => ctx.repositories.RoutingRule2.getByRoutingId(id)
};

Resolvers.Destination2 = {
  page: ({ pageId }, args, ctx) =>
    pageId ? ctx.repositories.QuestionPage.getById(pageId) : null,
  section: ({ sectionId }, args, ctx) =>
    sectionId ? ctx.repositories.Section.getById(sectionId) : null
};

Resolvers.RoutingRule2 = {
  destination: ({ destinationId }, args, ctx) =>
    ctx.repositories.Destination.getById(destinationId),
  expressionGroup: ({ id }, args, ctx) =>
    ctx.repositories.ExpressionGroup2.getByRuleId(id),
  routing: ({ routingId }, args, ctx) =>
    ctx.repositories.Routing2.getById(routingId)
};

Resolvers.ExpressionGroup2 = {
  expressions: ({ id }, args, ctx) =>
    ctx.repositories.BinaryExpression2.getByExpressionGroupId(id)
};

Resolvers.Expression2 = {
  __resolveType: () => "BinaryExpression2"
};

Resolvers.BinaryExpression2 = {
  left: async ({ id }, args, ctx) => {
    const left = await ctx.repositories.LeftSide2.getByExpressionId(id);
    if (left.type === "Answer") {
      const answer = await ctx.repositories.Answer.getById(left.answerId);
      return { ...answer, sideType: left.type };
    }
    throw new Error(`Unsupported side comparison of type: ${left.type}`);
  },
  right: async ({ id }, args, ctx) => {
    const right = await ctx.repositories.RightSide2.getByExpressionId(id);
    if (right && ["Custom", "SelectedOptions"].includes(right.type)) {
      return right;
    }

    return null;
  },
  expressionGroup: async ({ expressionGroupId }, args, ctx) =>
    ctx.repositories.ExpressionGroup2.getById(expressionGroupId)
};

Resolvers.LeftSide2 = {
  __resolveType: ({ type, sideType }) => {
    if (sideType === "Answer") {
      if ([answerTypes.RADIO, answerTypes.CHECKBOX].includes(type)) {
        return "MultipleChoiceAnswer";
      }
      return "BasicAnswer";
    }
  }
};

Resolvers.RightSide2 = {
  __resolveType: right => {
    if (right.type === "Custom") {
      return "CustomValue2";
    }
    if (right.type === "SelectedOptions") {
      return "SelectedOptions2";
    }
    return "BasicAnswer";
  }
};

Resolvers.CustomValue2 = {
  number: ({ customValue: { number } }) => number
};

Resolvers.SelectedOptions2 = {
  options: async ({ id }, args, ctx) => {
    const optionIds = await ctx.repositories.SelectedOptions2.getBySideId(id);
    const options = await Promise.all(
      optionIds.map(({ optionId }) => ctx.repositories.Option.getById(optionId))
    );
    return options;
  }
};

module.exports = Resolvers;
