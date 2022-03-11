const { v4: uuidv4 } = require("uuid");

const createQuestionPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "ListCollectorPage",
  title: "",
  listId: "",
  anotherTitle: "",
  anotherPositive: "Yes",
  anotherNegative: "No",
  addItemTitle: "",
  routing: null,
  ...input,
});

module.exports = createQuestionPage;
