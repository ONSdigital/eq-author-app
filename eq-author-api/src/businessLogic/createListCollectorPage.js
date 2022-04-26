const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createListCollectorPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "ListCollectorPage",
  title: "",
  listId: "",
  anotherTitle: "",
  anotherPositive: "Yes",
  anotherNegative: "No",
  anotherPositiveDescription: "",
  anotherNegativeDescription: "",
  addItemTitle: "",
  routing: null,
  alias: "",
  ...omit(input, "folderId"),
});

module.exports = createListCollectorPage;
