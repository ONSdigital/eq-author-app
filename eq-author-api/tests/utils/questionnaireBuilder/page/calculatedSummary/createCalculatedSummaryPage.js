const executeQuery = require("../../../executeQuery");

const createCalculatedSummaryPageMutation = `
  mutation CreateCalculatedSummaryPage($input: CreateCalculatedSummaryPageInput!) {
    createCalculatedSummaryPage(input: $input) {
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

const createCalculatedSummaryPage = async (questionnaire, { sectionId }) => {
  const result = await executeQuery(
    createCalculatedSummaryPageMutation,
    {
      input: { sectionId },
    },
    { questionnaire }
  );
  return result.data.createQuestionPage;
};

module.exports = {
  createCalculatedSummaryPageMutation,
  createCalculatedSummaryPage,
};
