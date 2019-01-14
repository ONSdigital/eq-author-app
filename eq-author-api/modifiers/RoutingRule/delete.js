module.exports = ({ repositories }) => async id => {
  const deletedRule = await repositories.RoutingRule2.delete(id);

  const parentRoutingId = deletedRule.routingId;

  const otherRules = await repositories.RoutingRule2.getByRoutingId(
    parentRoutingId
  );

  if (otherRules.length > 0) {
    return repositories.Routing2.getById(parentRoutingId);
  }

  return repositories.Routing2.delete(parentRoutingId);
};
