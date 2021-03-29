const { v4: uuidv4 } = require("uuid");

const createCalculatedSummary = (input = {}) => ({
  id: uuidv4(),
  title: "",
  pageType: "CalculatedSummaryPage",
  summaryAnswers: [],
  ...input,
});

module.exports = createCalculatedSummary;
