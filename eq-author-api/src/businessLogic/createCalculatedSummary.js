const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createCalculatedSummary = (input = {}) => ({
  id: uuidv4(),
  title: "",
  pageType: "CalculatedSummaryPage",
  summaryAnswers: [],
  totalTitle: "",
  ...omit(input, "folderId"),
});

module.exports = createCalculatedSummary;
