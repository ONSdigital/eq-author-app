const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createQuestionPage = require("./createQuestionPage");
const createCalculatedSummary = require("./createCalculatedSummary");

const createFolder = (input = {}, calcSum = false) => ({
  id: uuidv4(),
  alias: "",
  pages: [calcSum ? createCalculatedSummary() : createQuestionPage()],
  skipConditions: null,
  ...omit(input, "sectionId", "folderId"),
});

module.exports = createFolder;
