module.exports = ({ repositories }) => async expressionGroupId => {
  const expressionGroup = await repositories.ExpressionGroup2.getById(
    expressionGroupId
  );
  const rule = await repositories.RoutingRule2.getById(expressionGroup.ruleId);
  const routing = await repositories.Routing2.getById(rule.routingId);
  const firstAnswer = await repositories.Answer.getFirstOnPage(routing.pageId);
  const expression = await repositories.BinaryExpression2.insert({
    groupId: expressionGroupId
  });
  await repositories.LeftSide2.insert({
    expressionId: expression.id,
    answerId: firstAnswer.id
  });
  return expression;
};
