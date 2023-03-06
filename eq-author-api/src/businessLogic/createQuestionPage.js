const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createQuestionPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "QuestionPage",
  title: "",
  pageDescription: "",
  description: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  answers: [],
  routing: null,
  alias: null,
  ...omit(input, "folderId"),
});

module.exports = createQuestionPage;
