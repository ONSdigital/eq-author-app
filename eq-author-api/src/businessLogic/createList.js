const { v4: uuidv4 } = require("uuid");

const createList = () => ({
  id: uuidv4(),
  listName: null,
  answer: [],
});

module.exports = createList;
