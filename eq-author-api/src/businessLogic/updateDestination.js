const { UserInputError } = require("apollo-server-express");
const isMutuallyExclusive = require("../../utils/isMutuallyExclusive");
const containsSingleDestinationType = isMutuallyExclusive([
  "sectionId",
  "pageId",
  "logical",
]);

module.exports = (oldDestination, newDestination) => {
  if (!containsSingleDestinationType(newDestination)) {
    throw new UserInputError("Can only provide one destination.");
  }
  return {
    id: oldDestination.id,
    ...newDestination,
  };
};
