const executeQuery = require("../../../executeQuery");

const updateCalculatedSummaryPageMutation = `
  mutation updateCalculatedSummaryPage($input: UpdateCalculatedSummaryPageInput!) {
    updateCalculatedSummaryPage(input: $input) {
        id
        title
        alias
        displayName
        pageType
        section {
            id
        }
        position
        summaryAnswers {
            id
        }
        totalTitle
    }
  }
`;

const updateCalculatedSummaryPage = async (questionnaire, input) => {
  const result = await executeQuery(
    updateCalculatedSummaryPageMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.updateCalculatedSummaryPage;
};

module.exports = {
  updateCalculatedSummaryPageMutation,
  updateCalculatedSummaryPage,
};
