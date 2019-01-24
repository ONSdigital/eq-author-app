const { isNil } = require("lodash/fp");

module.exports = ({ availableDestinations, destinationField, destination }) => {
  let list;
  if (destinationField === "pageId") {
    list = availableDestinations.questionPages;
  } else if (destinationField === "sectionId") {
    list = availableDestinations.sections;
  }
  const id = destination[destinationField];

  const result = find({ id })(list);
  if (isNil(result)) {
    throw new Error(`The provided destination is invalid`);
  }
};
