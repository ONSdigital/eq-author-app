module.exports = ({ repositories, modifiers }) => async routingId => {
  const ruleDestination = await repositories.Destination.insert();
  const rule = await repositories.RoutingRule2.insert({
    routingId: routingId,
    destinationId: ruleDestination.id
  });
  const expressionGroup = await repositories.ExpressionGroup2.insert({
    ruleId: rule.id
  });
  await modifiers.BinaryExpression.create(expressionGroup.id);
  return rule;
};
