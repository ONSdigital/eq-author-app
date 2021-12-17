const { v4: uuidv4 } = require("uuid");

const createList = (input = {}) => ({
  id: uuidv4(),
  listName: "",
  displayName: "",
});

module.exports = createList;
