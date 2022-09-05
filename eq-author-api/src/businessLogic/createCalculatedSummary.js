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
      type: "",
      validation: {},
      properties: {},
    },
  ],
  summaryAnswers: [],
  totalTitle: "",
  type: "",
  ...omit(input, "folderId"),
});

module.exports = createCalculatedSummary;
