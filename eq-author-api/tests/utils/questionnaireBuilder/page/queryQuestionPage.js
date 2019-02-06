const executeQuery = require("../../executeQuery");

const getQuestionPageQuery = `
  query GetQuestionPage($input: QueryInput!) {
    page(input: $input) {
      id
      title
      position
      pages {
        id
      }
    }
  }
`;

const queryQuestionPage = async (questionnaire, pageId) => {
  const result = await executeQuery(
    getQuestionPageQuery,
    {
      input: { pageId },
    },
    questionnaire
  );

  return result.data.page;
};

module.exports = {
  getQuestionPageQuery,
  queryQuestionPage: queryQuestionPage,
};
