module.exports = ({ repositories, modifiers }) => async pageId => {
  const destination = await repositories.Destination.insert();
  const routing = await repositories.Routing2.insert({
    pageId,
    destinationId: destination.id
  });
  await modifiers.RoutingRule.create(routing.id);
  return routing;
};
