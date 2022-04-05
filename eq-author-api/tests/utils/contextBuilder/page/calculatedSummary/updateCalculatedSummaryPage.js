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
        comments {
          id
          commentText
        }
    }
  }
`;

const updateCalculatedSummaryPage = async (ctx, input) => {
  const result = await executeQuery(
    updateCalculatedSummaryPageMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updateCalculatedSummaryPage;
};

module.exports = {
  updateCalculatedSummaryPageMutation,
  updateCalculatedSummaryPage,
};
