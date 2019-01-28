const { find, isNil } = require("lodash/fp");

module.exports = ({ repositories }) => {
  const validateDestination = async (
    routing,
    destinationField,
    destination
  ) => {
    let list;
    if (destinationField === "pageId") {
      list = await repositories.QuestionPage.getFuturePagesInSection(
        routing.pageId
      );
    } else if (destinationField === "sectionId") {
      const { sectionId } = await repositories.Page.getById(routing.pageId);
      list = await repositories.Section.getFutureSections(sectionId);
    }
    const id = parseInt(destination[destinationField], 10);

    const result = find({ id })(list);
    if (isNil(result)) {
      throw new Error(`The provided destination is invalid`);
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
      ...destination,
    });
    return routing;
  };
};
