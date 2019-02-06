const executeQuery = require("../../executeQuery");

const deleteQuestionPageMutation = `
  mutation deleteQuestionPage($input: DeleteQuestionPageInput!) {
    deleteQuestionPage(input: $input) {
      id
    }
  }
`;

const deleteQuestionPage = async (questionnaire, page) => {
  const input = {
    id: page.id,
  };

  const result = await executeQuery(
    deleteQuestionPageMutation,
    { input },
    questionnaire
  );
  return result.data.deleteQuestionPage;
};

module.exports = {
  deleteQuestionPageMutation,
  deleteQuestionPage: deleteQuestionPage,
};
