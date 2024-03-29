const { v4: uuidv4 } = require("uuid");
const { omit } = require("lodash");

const createCalculatedSummary = (input = {}) => ({
  id: uuidv4(),
  title: "",
  pageType: "CalculatedSummaryPage",
  answers: [
    {
      id: uuidv4(),
      label: "",
      type: "Number",
      validation: {},
      properties: {},
    },
  ],
  summaryAnswers: [],
  pageDescription: "",
  totalTitle: "",
  type: "",
  ...omit(input, "folderId"),
});

module.exports = createCalculatedSummary;
