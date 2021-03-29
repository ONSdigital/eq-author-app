const { v4: uuidv4 } = require("uuid");
const createQuestionPage = require("./createQuestionPage");
const createCalculatedSummary = require("./createCalculatedSummary");

const createFolder = (input = {}, calcSum = false) => ({
  id: uuidv4(),
  alias: "",
  enabled: false,
  pages: [calcSum ? createCalculatedSummary() : createQuestionPage()],
  skipConditions: null,
  ...input,
});

module.exports = createFolder;
