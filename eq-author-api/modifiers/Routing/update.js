module.exports = ({ repositories }) => async ({ id, else: destination }) => {
  const routing = await repositories.Routing2.getById(id);

  await repositories.Destination.update({
    id: routing.destinationId,
    ...destination
  });
  return routing;
};
