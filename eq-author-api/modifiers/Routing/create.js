module.exports = ({ repositories, modifiers }) => async pageId => {
  const existingRouting = await repositories.Routing2.getByPageId(pageId);
  if (existingRouting) {
    throw new Error("Can only have one Routing per Page.");
  }

  const destination = await repositories.Destination.insert();
  const routing = await repositories.Routing2.insert({
    pageId,
    destinationId: destination.id
  });
  await modifiers.RoutingRule.create(routing.id);
  return routing;
};
