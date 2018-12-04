const Resolvers = {};

const createRule = async (routing, ctx) => {
  const ruleDestination = await ctx.repositories.Destination.insert();
  const rule = await ctx.repositories.RoutingRule2.insert({
    routingId: routing.id,
    destinationId: ruleDestination.id
  });
  const expressionGroup = await ctx.repositories.ExpressionGroup2.insert({
    ruleId: rule.id
  });
  const expression = await ctx.repositories.BinaryExpression2.insert({
    groupId: expressionGroup.id
  });
  const firstAnswer = await ctx.repositories.Answer.getFirstOnPage(
    routing.pageId
  );
  await ctx.repositories.LeftSide2.insert({
    expressionId: expression.id,
    answerId: firstAnswer.id
  });
  return rule;
};
const NUMERIC_DESTINATION_FIELDS = ["sectionId", "pageId"];
const normaliseDestinationInput = destination => {
  if (Object.keys(destination).length > 1) {
    throw new Error(`Can only provide one destination.`);
  }

  const destinationField = Object.keys(destination)[0];
  let value = destination[destinationField];
  if (NUMERIC_DESTINATION_FIELDS.includes(destinationField)) {
    value = parseInt(value, 10);
  }
  return { [destinationField]: value };
};

Resolvers.Mutation = {
  createRouting2: async (root, { input }, ctx) => {
    const destination = await ctx.repositories.Destination.insert();
    const pageId = parseInt(input.pageId, 10);
    const routing = await ctx.repositories.Routing2.insert({
      pageId,
      destinationId: destination.id
    });
    await createRule(routing, ctx);
    return routing;
  },
  updateRouting2: async (root, { input }, ctx) => {
    const routingId = parseInt(input.id, 10);
    const routing = await ctx.repositories.Routing2.getById(routingId);

    const normalisedDestination = normaliseDestinationInput(input.else);

    await ctx.repositories.Destination.update({
      id: routing.destinationId,
      ...normalisedDestination
    });
    return routing;
  },
  createRoutingRule2: async (root, { input }, ctx) => {
    const routingId = parseInt(input.routingId, 10);
    const routing = await ctx.repositories.Routing2.getById(routingId);
    return createRule(routing, ctx);
  },
  updateRoutingRule2: async (root, { input }, ctx) => {
    const normalisedDestination = normaliseDestinationInput(input.destination);

    const routingRuleId = parseInt(input.id, 10);
    const routingRule = await ctx.repositories.RoutingRule2.getById(
      routingRuleId
    );

    await ctx.repositories.Destination.update({
      id: routingRule.destinationId,
      ...normalisedDestination
    });
    return routingRule;
  },
  createBinaryExpression2: async (root, { input }, ctx) => {
    const expressionGroupId = parseInt(input.expressionGroupId, 10);
    const expressionGroup = await ctx.repositories.ExpressionGroup2.getById(
      expressionGroupId
    );
    const rule = await ctx.repositories.RoutingRule2.getById(
      expressionGroup.ruleId
    );
    const routing = await ctx.repositories.Routing2.getById(rule.routingId);
    const firstAnswer = await ctx.repositories.Answer.getFirstOnPage(
      routing.pageId
    );
    const expression = await ctx.repositories.BinaryExpression2.insert({
      groupId: expressionGroupId
    });
    await ctx.repositories.LeftSide2.insert({
      expressionId: expression.id,
      answerId: firstAnswer.id
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
      return ctx.repositories.Answer.getById(left.answerId);
    } else {
      throw new Error(`Unsupported side comparison of type: ${left.type}`);
    }
  },
  right: () => null,
  expressionGroup: async ({ expressionGroupId }, args, ctx) =>
    ctx.repositories.ExpressionGroup2.getById(expressionGroupId)
};

Resolvers.LeftSide2 = {
  __resolveType: () => "BasicAnswer"
};

Resolvers.RightSide2 = {
  __resolveType: () => "BasicAnswer"
};

module.exports = Resolvers;
