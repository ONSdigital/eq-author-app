const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createQuestionPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "QuestionPage",
  title: "",
  answers: [],
  routing: null,
  alias: null,
  ...omit(input, "folderId"),
});

module.exports = createQuestionPage;
