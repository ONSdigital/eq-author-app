module.exports = ({ repositories }) => async ({ id, destination }) => {
  const routingRule = await repositories.RoutingRule2.getById(id);

  await repositories.Destination.update({
    id: routingRule.destinationId,
    ...destination
  });
  return routingRule;
};
