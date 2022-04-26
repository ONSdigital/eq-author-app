const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");
const createQuestionPage = require("./createQuestionPage");
const createCalculatedSummary = require("./createCalculatedSummary");
const createListCollectorPage = require("./createListCollectorPage");

const createFolder = (input = {}, calcSum = false, listColl = false) => ({
  id: uuidv4(),
  alias: "",
  pages: [
    calcSum
      ? createCalculatedSummary()
      : listColl
      ? createListCollectorPage()
      : createQuestionPage(),
  ],
  skipConditions: null,
  ...omit(input, "sectionId", "folderId"),
});

module.exports = createFolder;
