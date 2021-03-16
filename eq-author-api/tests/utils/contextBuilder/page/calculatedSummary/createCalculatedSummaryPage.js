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
            folders {
              id
            }
        }
        position
        summaryAnswers {
            id
        }
        totalTitle
    }
  }
`;

const createCalculatedSummaryPage = async (ctx, { folderId, position }) => {
  const result = await executeQuery(
    createCalculatedSummaryPageMutation,
    {
      input: { folderId, position },
    },
    ctx
  );
  return result.data.createQuestionPage;
};

module.exports = {
  createCalculatedSummaryPageMutation,
  createCalculatedSummaryPage,
};
