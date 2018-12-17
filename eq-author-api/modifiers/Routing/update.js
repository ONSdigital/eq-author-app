const { find, isNil } = require("lodash/fp");

module.exports = ({ repositories }) => {
  const validateDestination = async (
    routing,
    destinationField,
    destination
  ) => {
    const availableDestinations = await repositories.Page.getRoutingDestinations(
      routing.pageId
    );
    let list;
    if (destinationField === "pageId") {
      list = availableDestinations.questionPages;
    } else if (destinationField === "sectionId") {
      list = availableDestinations.sections;
    }
    const id = parseInt(destination[destinationField], 10);

    const result = find({ id })(list);
    if (isNil(result)) {
      throw new Error(`The provided desination is invalid`);
    }
  };

  return async ({ id, else: destination }) => {
    const routing = await repositories.Routing2.getById(id);
    const destinationField = Object.keys(destination)[0];
    if (destinationField !== "logical") {
      await validateDestination(routing, destinationField, destination);
    }

    await repositories.Destination.update({
      id: routing.destinationId,
      ...destination
    });
    return routing;
  };
};
