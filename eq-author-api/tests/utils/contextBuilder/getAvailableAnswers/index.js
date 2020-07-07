const executeQuery = require("../../executeQuery");

const getAvailableAnswers = `
query GetAvailableAnswers($input: GetAvailableAnswersInput!) {
  getAvailableAnswers(input: $input) {
    id
    displayName
    properties
    type
    page {
      id
      displayName
      section {
        id
        displayName
      }
    }
  }
}`;

const queryGetAvailableAnswers = async (ctx, pageId, includeSelf) => {
  const input = {
    pageId,
    includeSelf,
  };
  const result = await executeQuery(
    getAvailableAnswers,
    {
      input,
    },
    ctx
  );
  return result.data.getAvailableAnswers;
};

module.exports = {
  queryGetAvailableAnswers,
  getAvailableAnswers,
};
