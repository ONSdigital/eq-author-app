const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createList = (input = {}) => ({
  id: uuidv4(),
  listName: "",
  displayName: "",
  ...omit(input),
});

module.exports = createList;
